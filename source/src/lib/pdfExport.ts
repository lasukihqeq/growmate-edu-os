import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

/**
 * PDF导出进度回调
 */
export type ProgressCallback = (progress: number, stage: string) => void

/**
 * 将报告 DOM 容器导出为 PDF 文件（优化版）
 *
 * 优化策略：
 * 1. 分块渲染 - 避免内存溢出
 * 2. 适当降低scale - 平衡质量和性能
 * 3. 进度回调 - 提升用户体验
 * 4. 使用JPEG压缩 - 减小文件体积
 *
 * @param containerEl 报告容器 DOM 元素
 * @param studentName 学生姓名（用于文件命名）
 * @param onProgress 进度回调（可选）
 */
export async function exportReportAsPdf(
  containerEl: HTMLElement,
  studentName: string,
  onProgress?: ProgressCallback
): Promise<void> {
  const updateProgress = (progress: number, stage: string) => {
    onProgress?.(progress, stage)
  }

  updateProgress(0, '准备导出...')

  // A4 尺寸（mm）
  const A4_WIDTH = 210
  const A4_HEIGHT = 297

  // 获取容器尺寸
  const containerRect = containerEl.getBoundingClientRect()
  const containerHeight = containerRect.height
  const containerWidth = containerRect.width

  // 计算需要分多少块渲染（每块最大4000px高度）
  const CHUNK_HEIGHT = 4000
  const totalChunks = Math.ceil(containerHeight / CHUNK_HEIGHT)

  updateProgress(5, '初始化渲染引擎...')

  // 如果内容较短，直接渲染
  if (containerHeight < CHUNK_HEIGHT) {
    return await renderSinglePage(containerEl, studentName, A4_WIDTH, A4_HEIGHT, updateProgress)
  }

  // 长内容分块渲染
  updateProgress(10, `分块渲染中 (1/${totalChunks})...`)

  // 创建PDF
  const pdf = new jsPDF('p', 'mm', 'a4')

  for (let i = 0; i < totalChunks; i++) {
    const startY = i * CHUNK_HEIGHT
    const endY = Math.min((i + 1) * CHUNK_HEIGHT, containerHeight)
    const chunkHeight = endY - startY

    updateProgress(
      10 + (i / totalChunks) * 70,
      `渲染中 (${i + 1}/${totalChunks})...`
    )

    // 创建临时容器
    const tempContainer = document.createElement('div')
    tempContainer.style.cssText = `
      position: absolute;
      left: -9999px;
      top: 0;
      width: ${containerWidth}px;
      height: ${chunkHeight}px;
      overflow: hidden;
    `
    document.body.appendChild(tempContainer)

    // 克隆内容
    const clone = containerEl.cloneNode(true) as HTMLElement
    clone.style.transform = `translateY(-${startY}px)`
    clone.style.position = 'relative'
    tempContainer.appendChild(clone)

    // 渲染当前块
    const canvas = await html2canvas(tempContainer, {
      scale: 1.5, // 降低scale提升性能
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 15000,
      ignoreElements: (el: Element) => {
        return el.classList.contains('no-print') ||
               el.classList.contains('rpt-floating-actions') ||
               el.classList.contains('rpt-nav-sidebar')
      },
    })

    // 清理临时容器
    document.body.removeChild(tempContainer)

    // 计算图片尺寸
    const imgData = canvas.toDataURL('image/jpeg', 0.85)
    const imgWidth = A4_WIDTH
    const imgHeight = (canvas.height * A4_WIDTH) / canvas.width

    // 添加到PDF
    if (i > 0) {
      pdf.addPage()
    }
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight)

    // 给UI线程喘息的机会
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  updateProgress(90, '生成PDF文件...')

  // 保存文件
  const date = new Date().toISOString().slice(0, 10)
  pdf.save(`WILDER报告_${studentName}_${date}.pdf`)

  updateProgress(100, '导出完成')
}

/**
 * 单页渲染（短内容优化路径）
 */
async function renderSinglePage(
  containerEl: HTMLElement,
  studentName: string,
  A4_WIDTH: number,
  A4_HEIGHT: number,
  updateProgress: (progress: number, stage: string) => void
): Promise<void> {
  updateProgress(10, '渲染报告内容...')

  const canvas = await html2canvas(containerEl, {
    scale: 1.5,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: '#ffffff',
    imageTimeout: 15000,
    ignoreElements: (el: Element) => {
      return el.classList.contains('no-print') ||
             el.classList.contains('rpt-floating-actions') ||
             el.classList.contains('rpt-nav-sidebar')
    },
  })

  updateProgress(60, '生成PDF...')

  const imgData = canvas.toDataURL('image/jpeg', 0.85)
  const imgWidth = A4_WIDTH
  const imgHeight = (canvas.height * A4_WIDTH) / canvas.width

  const pdf = new jsPDF('p', 'mm', 'a4')
  let heightLeft = imgHeight
  let position = 0

  // 第一页
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
  heightLeft -= A4_HEIGHT

  // 后续分页
  while (heightLeft > 0) {
    position -= A4_HEIGHT
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= A4_HEIGHT
  }

  updateProgress(90, '保存文件...')

  const date = new Date().toISOString().slice(0, 10)
  pdf.save(`WILDER报告_${studentName}_${date}.pdf`)

  updateProgress(100, '导出完成')
}

/**
 * 快速打印（使用浏览器原生打印功能）
 * 性能最佳，但依赖用户手动选择"另存为PDF"
 */
export function quickPrint(): void {
  window.print()
}
