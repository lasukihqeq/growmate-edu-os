import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Upload, FileText, Image, Video, File, X, Plus, Search, Filter, Calendar,
  Grid3X3, List, ChevronDown, ChevronUp, Tag, Clock, Trash2, Eye, Download,
  FolderOpen, Star, Award, BookOpen, MessageSquare, ClipboardList, Camera
} from 'lucide-react'

// ==================== 类型定义 ====================
interface Attachment {
  id: string
  name: string
  type: string
  size: number
  data?: string // base64
  url?: string
  uploadProgress?: number
}

interface GrowthRecord {
  id: string
  studentId: string
  studentName: string
  title: string
  description: string
  category: 'assessment' | 'growth' | 'portfolio' | 'achievement' | 'feedback' | 'observation' | 'certificate'
  wilderDimensions: ('W' | 'I' | 'L' | 'D' | 'E' | 'R')[]
  date: string
  attachments: Attachment[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

// ==================== 常量定义 ====================
const STORAGE_KEY = 'wilder_growth_records'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

const CATEGORIES: Record<GrowthRecord['category'], { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  assessment: { label: '测评报告', icon: <ClipboardList className="w-4 h-4" />, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  growth: { label: '成长记录', icon: <BookOpen className="w-4 h-4" />, color: 'text-green-600', bgColor: 'bg-green-50' },
  portfolio: { label: '作品集', icon: <Camera className="w-4 h-4" />, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  achievement: { label: '学习成果', icon: <Star className="w-4 h-4" />, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  feedback: { label: '家长反馈', icon: <MessageSquare className="w-4 h-4" />, color: 'text-pink-600', bgColor: 'bg-pink-50' },
  observation: { label: '教师观察', icon: <Eye className="w-4 h-4" />, color: 'text-[#2A4CC0]', bgColor: 'bg-teal-50' },
  certificate: { label: '证书奖项', icon: <Award className="w-4 h-4" />, color: 'text-orange-600', bgColor: 'bg-orange-50' },
}

const WILDER_DIMENSIONS: { key: 'W' | 'I' | 'L' | 'D' | 'E' | 'R'; label: string; color: string }[] = [
  { key: 'W', label: 'W-好奇探索', color: 'bg-blue-500' },
  { key: 'I', label: 'I-想象创造', color: 'bg-purple-500' },
  { key: 'L', label: 'L-逻辑推理', color: 'bg-green-500' },
  { key: 'D', label: 'D-动手实践', color: 'bg-orange-500' },
  { key: 'E', label: 'E-表达分享', color: 'bg-pink-500' },
  { key: 'R', label: 'R-坚韧专注', color: 'bg-[#3B5FD9]' },
]

// ==================== 工具函数 ====================
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image className="w-5 h-5 text-purple-500" />
  if (type === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />
  if (type.includes('word') || type.includes('document')) return <FileText className="w-5 h-5 text-blue-500" />
  if (type.startsWith('video/')) return <Video className="w-5 h-5 text-green-500" />
  return <File className="w-5 h-5 text-gray-500" />
}

// ==================== 主组件 ====================
export function GrowthArchive() {
  // 状态管理
  const [records, setRecords] = useState<GrowthRecord[]>([])
  const [viewMode, setViewMode] = useState<'timeline' | 'card' | 'list'>('timeline')
  const [showForm, setShowForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState<GrowthRecord | null>(null)
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(new Set())
  
  // 筛选状态
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [wilderFilter, setWilderFilter] = useState<string>('')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })
  const [showFilters, setShowFilters] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState<Partial<GrowthRecord>>({
    studentName: '',
    title: '',
    description: '',
    category: 'growth',
    wilderDimensions: [],
    date: new Date().toISOString().split('T')[0],
    attachments: [],
    tags: [],
  })
  const [customTag, setCustomTag] = useState('')
  const [uploadingFiles, setUploadingFiles] = useState<Map<string, number>>(new Map())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // 从 localStorage 加载数据
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        setRecords(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error('加载成长档案失败:', err)
    }
  }, [])

  // 保存到 localStorage
  const saveRecords = useCallback((newRecords: GrowthRecord[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newRecords))
      setRecords(newRecords)
    } catch (err) {
      console.error('保存成长档案失败:', err)
      alert('存储空间不足，请清理部分档案后重试')
    }
  }, [])

  // 筛选后的记录
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      // 按姓名搜索
      if (searchQuery && !record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !record.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // 按分类筛选
      if (categoryFilter && record.category !== categoryFilter) {
        return false
      }
      // 按 WILDER 维度筛选
      if (wilderFilter && !record.wilderDimensions.includes(wilderFilter as any)) {
        return false
      }
      // 按日期范围筛选
      if (dateRange.start && record.date < dateRange.start) {
        return false
      }
      if (dateRange.end && record.date > dateRange.end) {
        return false
      }
      return true
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [records, searchQuery, categoryFilter, wilderFilter, dateRange])

  // 按学生分组（用于时间线视图）
  const recordsByStudent = useMemo(() => {
    const grouped: Record<string, GrowthRecord[]> = {}
    filteredRecords.forEach(record => {
      if (!grouped[record.studentName]) {
        grouped[record.studentName] = []
      }
      grouped[record.studentName].push(record)
    })
    return grouped
  }, [filteredRecords])

  // 文件处理函数
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    
    for (const file of fileArray) {
      // 检查文件大小
      if (file.size > MAX_FILE_SIZE) {
        alert(`文件 "${file.name}" 超过 5MB 限制，请压缩后重试`)
        continue
      }

      // 检查文件类型
      const isAccepted = Object.keys(ACCEPTED_FILE_TYPES).some(type => {
        if (file.type === type) return true
        const extensions = ACCEPTED_FILE_TYPES[type as keyof typeof ACCEPTED_FILE_TYPES]
        return extensions.some(ext => file.name.toLowerCase().endsWith(ext))
      })

      if (!isAccepted && !file.type.startsWith('video/')) {
        alert(`不支持的文件类型: ${file.name}`)
        continue
      }

      const fileId = generateId()
      setUploadingFiles(prev => new Map(prev).set(fileId, 0))

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => {
          const current = prev.get(fileId) || 0
          if (current >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return new Map(prev).set(fileId, current + 10)
        })
      }, 100)

      // 读取文件为 base64
      const reader = new FileReader()
      reader.onload = () => {
        clearInterval(progressInterval)
        setUploadingFiles(prev => {
          const newMap = new Map(prev)
          newMap.delete(fileId)
          return newMap
        })

        const attachment: Attachment = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          data: reader.result as string,
        }

        setFormData(prev => ({
          ...prev,
          attachments: [...(prev.attachments || []), attachment],
        }))
      }
      reader.onerror = () => {
        clearInterval(progressInterval)
        setUploadingFiles(prev => {
          const newMap = new Map(prev)
          newMap.delete(fileId)
          return newMap
        })
        alert(`读取文件失败: ${file.name}`)
      }
      reader.readAsDataURL(file)
    }
  }

  // 拖拽处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-teal-500', 'bg-teal-50')
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-teal-500', 'bg-teal-50')
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-teal-500', 'bg-teal-50')
    }
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // 删除附件
  const removeAttachment = (attachmentId: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: (prev.attachments || []).filter(a => a.id !== attachmentId),
    }))
  }

  // 添加自定义标签
  const addCustomTag = () => {
    if (customTag.trim() && !(formData.tags || []).includes(customTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), customTag.trim()],
      }))
      setCustomTag('')
    }
  }

  // 删除标签
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag),
    }))
  }

  // 切换 WILDER 维度
  const toggleWilderDimension = (dim: 'W' | 'I' | 'L' | 'D' | 'E' | 'R') => {
    setFormData(prev => {
      const dims = prev.wilderDimensions || []
      const newDims = dims.includes(dim) ? dims.filter(d => d !== dim) : [...dims, dim]
      return { ...prev, wilderDimensions: newDims }
    })
  }

  // 提交表单
  const handleSubmit = () => {
    if (!formData.studentName || !formData.title) {
      alert('请填写学生姓名和标题')
      return
    }

    const now = new Date().toISOString()
    const newRecord: GrowthRecord = {
      id: editingRecord?.id || generateId(),
      studentId: editingRecord?.studentId || generateId(),
      studentName: formData.studentName!,
      title: formData.title!,
      description: formData.description || '',
      category: formData.category as GrowthRecord['category'],
      wilderDimensions: formData.wilderDimensions || [],
      date: formData.date || now.split('T')[0],
      attachments: formData.attachments || [],
      tags: formData.tags || [],
      createdAt: editingRecord?.createdAt || now,
      updatedAt: now,
    }

    const newRecords = editingRecord
      ? records.map(r => r.id === editingRecord.id ? newRecord : r)
      : [...records, newRecord]

    saveRecords(newRecords)
    resetForm()
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      studentName: '',
      title: '',
      description: '',
      category: 'growth',
      wilderDimensions: [],
      date: new Date().toISOString().split('T')[0],
      attachments: [],
      tags: [],
    })
    setEditingRecord(null)
    setShowForm(false)
    setCustomTag('')
  }

  // 编辑记录
  const handleEdit = (record: GrowthRecord) => {
    setFormData({
      studentName: record.studentName,
      title: record.title,
      description: record.description,
      category: record.category,
      wilderDimensions: record.wilderDimensions,
      date: record.date,
      attachments: record.attachments,
      tags: record.tags,
    })
    setEditingRecord(record)
    setShowForm(true)
  }

  // 删除记录
  const handleDelete = (recordId: string) => {
    if (confirm('确定要删除这条档案记录吗？')) {
      saveRecords(records.filter(r => r.id !== recordId))
    }
  }

  // 切换展开
  const toggleExpand = (recordId: string) => {
    setExpandedRecords(prev => {
      const newSet = new Set(prev)
      if (newSet.has(recordId)) {
        newSet.delete(recordId)
      } else {
        newSet.add(recordId)
      }
      return newSet
    })
  }

  // 清除筛选
  const clearFilters = () => {
    setSearchQuery('')
    setCategoryFilter('')
    setWilderFilter('')
    setDateRange({ start: '', end: '' })
  }

  // ==================== 渲染组件 ====================

  // 附件预览组件
  const AttachmentPreview = ({ attachment }: { attachment: Attachment }) => {
    const isImage = attachment.type.startsWith('image/')
    
    return (
      <div className="relative group bg-gray-50 rounded-lg p-2 flex items-center gap-2">
        {isImage && attachment.data ? (
          <img src={attachment.data} alt={attachment.name} className="w-10 h-10 object-cover rounded" />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
            {getFileIcon(attachment.type)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-700 truncate">{attachment.name}</p>
          <p className="text-[10px] text-gray-400">{formatFileSize(attachment.size)}</p>
        </div>
        {attachment.data && (
          <a
            href={attachment.data}
            download={attachment.name}
            className="p-1 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Download className="w-4 h-4" />
          </a>
        )}
      </div>
    )
  }

  // 记录卡片组件
  const RecordCard = ({ record, compact = false }: { record: GrowthRecord; compact?: boolean }) => {
    const cat = CATEGORIES[record.category]
    const isExpanded = expandedRecords.has(record.id)
    const firstImage = record.attachments.find(a => a.type.startsWith('image/'))

    return (
      <div className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all ${compact ? 'p-3' : 'p-4'}`}>
        <div className="flex items-start gap-3">
          {/* 缩略图 */}
          {firstImage?.data && !compact && (
            <img src={firstImage.data} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
          )}
          
          <div className="flex-1 min-w-0">
            {/* 头部 */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 truncate">{record.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{record.studentName} · {record.date}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${cat.bgColor} ${cat.color}`}>
                {cat.icon}
                <span className="hidden sm:inline">{cat.label}</span>
              </div>
            </div>

            {/* WILDER 维度标签 */}
            {record.wilderDimensions.length > 0 && (
              <div className="flex gap-1 mt-2">
                {record.wilderDimensions.map(dim => {
                  const dimInfo = WILDER_DIMENSIONS.find(d => d.key === dim)
                  return (
                    <span key={dim} className={`text-[10px] px-1.5 py-0.5 rounded text-white ${dimInfo?.color}`}>
                      {dim}
                    </span>
                  )
                })}
              </div>
            )}

            {/* 描述 */}
            {!compact && record.description && (
              <p className={`text-sm text-gray-600 mt-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
                {record.description}
              </p>
            )}

            {/* 标签 */}
            {!compact && record.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {record.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* 附件预览 */}
            {!compact && isExpanded && record.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {record.attachments.map(att => (
                  <AttachmentPreview key={att.id} attachment={att} />
                ))}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-50">
              <button
                onClick={() => toggleExpand(record.id)}
                className="text-xs text-gray-500 hover:text-[#2A4CC0] flex items-center gap-1"
              >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {isExpanded ? '收起' : '展开'}
                {record.attachments.length > 0 && ` (${record.attachments.length}附件)`}
              </button>
              <div className="flex-1" />
              <button onClick={() => handleEdit(record)} className="text-xs text-blue-500 hover:text-blue-700">
                编辑
              </button>
              <button onClick={() => handleDelete(record.id)} className="text-xs text-red-500 hover:text-red-700">
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 时间线视图
  const TimelineView = () => (
    <div className="space-y-8">
      {Object.entries(recordsByStudent).map(([studentName, studentRecords]) => (
        <div key={studentName} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#3B5FD9] text-white flex items-center justify-center text-sm font-bold">
              {studentName.charAt(0)}
            </div>
            {studentName}
            <span className="text-sm font-normal text-gray-400">({studentRecords.length}条记录)</span>
          </h3>
          
          <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
            {studentRecords.map((record) => {
              const cat = CATEGORIES[record.category]
              const isExpanded = expandedRecords.has(record.id)
              
              return (
                <div key={record.id} className="relative">
                  {/* 时间线节点 */}
                  <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-2 border-white ${cat.bgColor.replace('bg-', 'bg-').replace('50', '500')}`} 
                       style={{ backgroundColor: cat.color.replace('text-', '').includes('blue') ? '#3b82f6' : 
                                                cat.color.includes('green') ? '#22c55e' :
                                                cat.color.includes('purple') ? '#a855f7' :
                                                cat.color.includes('amber') ? '#f59e0b' :
                                                cat.color.includes('pink') ? '#ec4899' :
                                                cat.color.includes('teal') ? '#14b8a6' :
                                                cat.color.includes('orange') ? '#f97316' : '#6b7280' }} />
                  
                  {/* 日期标签 */}
                  <div className="absolute -left-[85px] text-xs text-gray-400 w-14 text-right">
                    {new Date(record.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </div>

                  {/* 内容卡片 */}
                  <div className="ml-2 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`p-1 rounded ${cat.bgColor}`}>{cat.icon}</span>
                          <h4 className="font-medium text-gray-800">{record.title}</h4>
                        </div>
                        
                        {record.wilderDimensions.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {record.wilderDimensions.map(dim => {
                              const dimInfo = WILDER_DIMENSIONS.find(d => d.key === dim)
                              return (
                                <span key={dim} className={`text-[10px] px-1.5 py-0.5 rounded text-white ${dimInfo?.color}`}>
                                  {dim}
                                </span>
                              )
                            })}
                          </div>
                        )}

                        {record.description && (
                          <p className={`text-sm text-gray-600 mt-2 ${isExpanded ? '' : 'line-clamp-2'}`}>
                            {record.description}
                          </p>
                        )}

                        {record.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {record.tags.map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-white rounded text-xs text-gray-500">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {isExpanded && record.attachments.length > 0 && (
                          <div className="mt-3 grid gap-2">
                            {record.attachments.map(att => (
                              <AttachmentPreview key={att.id} attachment={att} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => toggleExpand(record.id)}
                        className="text-xs text-gray-500 hover:text-[#2A4CC0] flex items-center gap-1"
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {isExpanded ? '收起' : '详情'}
                        {record.attachments.length > 0 && ` (${record.attachments.length}附件)`}
                      </button>
                      <button onClick={() => handleEdit(record)} className="text-xs text-blue-500 hover:text-blue-700">编辑</button>
                      <button onClick={() => handleDelete(record.id)} className="text-xs text-red-500 hover:text-red-700">删除</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {Object.keys(recordsByStudent).length === 0 && (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">暂无成长档案</p>
          <p className="text-sm text-gray-300 mt-1">点击右上角「添加档案」开始记录</p>
        </div>
      )}
    </div>
  )

  // 卡片视图
  const CardView = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredRecords.map(record => (
        <RecordCard key={record.id} record={record} />
      ))}
      {filteredRecords.length === 0 && (
        <div className="col-span-full text-center py-16">
          <FolderOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">暂无匹配的档案记录</p>
        </div>
      )}
    </div>
  )

  // 列表视图
  const ListView = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500">
            <th className="px-4 py-3 text-left font-medium">学生</th>
            <th className="px-4 py-3 text-left font-medium">标题</th>
            <th className="px-4 py-3 text-center font-medium">分类</th>
            <th className="px-4 py-3 text-center font-medium">WILDER</th>
            <th className="px-4 py-3 text-center font-medium">日期</th>
            <th className="px-4 py-3 text-center font-medium">附件</th>
            <th className="px-4 py-3 text-center font-medium">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {filteredRecords.map(record => {
            const cat = CATEGORIES[record.category]
            return (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{record.studentName}</td>
                <td className="px-4 py-3">
                  <p className="text-gray-800">{record.title}</p>
                  {record.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {record.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] text-gray-500">#{tag}</span>
                      ))}
                      {record.tags.length > 2 && <span className="text-[10px] text-gray-400">+{record.tags.length - 2}</span>}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${cat.bgColor} ${cat.color}`}>
                    {cat.icon}
                    {cat.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex gap-0.5 justify-center">
                    {record.wilderDimensions.map(dim => {
                      const dimInfo = WILDER_DIMENSIONS.find(d => d.key === dim)
                      return (
                        <span key={dim} className={`text-[10px] w-5 h-5 rounded flex items-center justify-center text-white ${dimInfo?.color}`}>
                          {dim}
                        </span>
                      )
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-500">{record.date}</td>
                <td className="px-4 py-3 text-center text-gray-500">{record.attachments.length || '-'}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => handleEdit(record)} className="text-xs text-blue-600 hover:text-blue-800 mr-2">编辑</button>
                  <button onClick={() => handleDelete(record.id)} className="text-xs text-red-500 hover:text-red-700">删除</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">暂无匹配的档案记录</p>
        </div>
      )}
    </div>
  )

  // ==================== 主渲染 ====================
  return (
    <div className="space-y-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">成长档案管理</h2>
          <p className="text-sm text-gray-500 mt-1">记录每个孩子的成长轨迹，支持多格式文件上传</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-[#3B5FD9] text-white rounded-xl hover:bg-[#2A4CC0] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加档案
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-3">
          {/* 搜索框 */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="搜索学生姓名或标题..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
            />
          </div>

          {/* 分类筛选 */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
          >
            <option value="">全部分类</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>{cat.label}</option>
            ))}
          </select>

          {/* WILDER 筛选 */}
          <select
            value={wilderFilter}
            onChange={e => setWilderFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white"
          >
            <option value="">全部维度</option>
            {WILDER_DIMENSIONS.map(dim => (
              <option key={dim.key} value={dim.key}>{dim.label}</option>
            ))}
          </select>

          {/* 更多筛选 */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border text-sm flex items-center gap-2 transition-colors ${
              showFilters ? 'border-teal-500 text-[#2A4CC0] bg-teal-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            筛选
          </button>

          {/* 视图切换 */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'timeline' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
              }`}
            >
              <Clock className="w-3 h-3" />
              时间线
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'card' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
              }`}
            >
              <Grid3X3 className="w-3 h-3" />
              卡片
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1 ${
                viewMode === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
              }`}
            >
              <List className="w-3 h-3" />
              列表
            </button>
          </div>

          {/* 统计 */}
          <div className="text-sm text-gray-400 self-center">
            共 {filteredRecords.length} 条档案
          </div>
        </div>

        {/* 日期范围筛选 */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">日期范围:</span>
            </div>
            <input
              type="date"
              value={dateRange.start}
              onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <span className="text-gray-400">至</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
            <button
              onClick={clearFilters}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              清除筛选
            </button>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      {viewMode === 'timeline' && <TimelineView />}
      {viewMode === 'card' && <CardView />}
      {viewMode === 'list' && <ListView />}

      {/* 添加/编辑表单弹窗 */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">
                {editingRecord ? '编辑档案' : '添加成长档案'}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* 基本信息 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">学生姓名 *</label>
                  <input
                    value={formData.studentName || ''}
                    onChange={e => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                    placeholder="请输入学生姓名"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">日期 *</label>
                  <input
                    type="date"
                    value={formData.date || ''}
                    onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">标题 *</label>
                <input
                  value={formData.title || ''}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
                  placeholder="请输入档案标题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
                  placeholder="请输入档案描述..."
                />
              </div>

              {/* 分类选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => setFormData(prev => ({ ...prev, category: key as GrowthRecord['category'] }))}
                      className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 transition-all ${
                        formData.category === key
                          ? `${cat.bgColor} ${cat.color} ring-2 ring-offset-1`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      style={formData.category === key ? { ['--tw-ring-color' as string]: cat.color.replace('text-', '') } : {}}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* WILDER 维度 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">关联 WILDER 维度</label>
                <div className="flex flex-wrap gap-2">
                  {WILDER_DIMENSIONS.map(dim => (
                    <button
                      key={dim.key}
                      onClick={() => toggleWilderDimension(dim.key)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        (formData.wilderDimensions || []).includes(dim.key)
                          ? `${dim.color} text-white`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {dim.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 自定义标签 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(formData.tags || []).map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-gray-100 rounded-full text-sm text-gray-700 flex items-center gap-1">
                      #{tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={customTag}
                    onChange={e => setCustomTag(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    placeholder="输入自定义标签，回车添加"
                  />
                  <button
                    onClick={addCustomTag}
                    className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
                  >
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 文件上传 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">附件</label>
                <div
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all"
                >
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">点击或拖拽文件到这里上传</p>
                  <p className="text-xs text-gray-400 mt-1">支持 PDF、图片、Word 文档，单文件最大 5MB</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                  onChange={e => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />

                {/* 上传进度 */}
                {uploadingFiles.size > 0 && (
                  <div className="mt-3 space-y-2">
                    {Array.from(uploadingFiles.entries()).map(([id, progress]) => (
                      <div key={id} className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#3B5FD9] transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{progress}%</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 已上传附件列表 */}
                {(formData.attachments || []).length > 0 && (
                  <div className="mt-3 space-y-2">
                    {(formData.attachments || []).map(att => (
                      <div key={att.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {att.type.startsWith('image/') && att.data ? (
                          <img src={att.data} alt={att.name} className="w-12 h-12 object-cover rounded" />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                            {getFileIcon(att.type)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{att.name}</p>
                          <p className="text-xs text-gray-400">{formatFileSize(att.size)}</p>
                        </div>
                        <button
                          onClick={() => removeAttachment(att.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 视频链接输入 */}
                <div className="mt-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Video className="w-4 h-4" />
                    或添加视频链接
                  </div>
                  <input
                    placeholder="粘贴视频链接 (如 B站、优酷等)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    onBlur={e => {
                      const url = e.target.value.trim()
                      if (url && url.startsWith('http')) {
                        const att: Attachment = {
                          id: generateId(),
                          name: '视频链接',
                          type: 'video/link',
                          size: 0,
                          url,
                        }
                        setFormData(prev => ({
                          ...prev,
                          attachments: [...(prev.attachments || []), att],
                        }))
                        e.target.value = ''
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* 表单底部 */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#3B5FD9] text-white rounded-xl hover:bg-[#2A4CC0] transition-colors text-sm font-medium"
              >
                {editingRecord ? '保存修改' : '添加档案'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GrowthArchive
