import dayjs from 'dayjs';

/**
 * 对象转url参数
 * @param data
 * @return string
 */
export function parseParams(data: Record<string, any>) {
  try {
    const tempArr: string[] = [];
    for (const i in data) {
      const key = encodeURIComponent(i);
      let val = data[i];
      // 内容中含有？ 会截断后续参数解析
      if (`${val}`.includes('?')) {
        val = encodeURIComponent(val);
      }
      tempArr.push(`${key}=${val}`);
    }
    return tempArr.join('&');
  } catch {
    return '';
  }
}
// 二维码下载
export function downloadHandle(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = '二维码';
  document.body.append(a);
  a.click();
  setTimeout(() => {
    a.remove();
  }, 0);
}
// 获取完整日期时间 年 月 日 时 分 秒 周几
export function fullDays() {
  const dateTime = ref<string[]>([]);
  const weekToChinese = ['天', '一', '二', '三', '四', '五', '六'];
  const time = setInterval<any>(() => {
    dateTime.value = [
      dayjs().format('YYYY-MM-DD'),
      `星期${weekToChinese[dayjs().day()]}`,
      dayjs().format('HH:mm:ss'),
    ];
  }, 1000);
  onUnmounted(() => {
    clearInterval(time);
  });
  return dateTime;
}

// 数字格式化（每三位加个逗号）
export function toThousands(num) {
  let result = '',
    counter = 0;
  num = (num || 0).toString();
  for (let i = num.length - 1; i >= 0; i--) {
    counter++;
    result = num.charAt(i) + result;
    if (!(counter % 3) && i !== 0) {
      result = `,${result}`;
    }
  }
  return result;
}

export const hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * 防抖函数
 * @param {Function} fn
 * @param {number} delay
 * @returns {void}
 */
export function debounce(fn: Function, delay: number = 100): () => void {
  let timer: NodeJS.Timeout;
  return function (...args: any[]): void {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      typeof fn === 'function' && fn.apply(null, args);
      clearTimeout(timer);
    }, delay);
  };
}

export function generateArray(n: number, center: number): number[][] {
  const arr: number[][] = Array.from({ length: 2 * n - 1 });
  const result: number[][] = [];
  const plusValue = center / n;

  // 初始化二维数组，将所有元素初始化为0
  for (let i = 0; i < 2 * n - 1; i++) {
    arr[i] = Array.from({ length: 2 * n - 1 }).fill(0) as any;
  }

  for (let level = 0; level < n; level++) {
    for (let i = level; i < 2 * n - 1 - level; i++) {
      arr[level][i] = level * plusValue;
      arr[i][level] = level * plusValue;
      arr[2 * n - 2 - i][2 * n - 2 - level] = level * plusValue;
      arr[2 * n - 2 - level][2 * n - 2 - i] = level * plusValue;
    }
  }

  arr.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      result.push([rowIndex, colIndex, value]);
    });
  });

  return result;
}
export async function loadImageFile(url): Promise<HTMLImageElement | undefined> {
  if (!url) {
    return;
  }
  const img = new Image();
  url = URL.createObjectURL(await (await fetch(url)).blob());
  img.src = url;
  // img.src = (await import(url)).default;
  return new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve(img));
    img.onerror = reject;
  });
}

export function fileToBase64(file) {
  if (!file || typeof file === 'string') {
    return;
  }
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.height = file.naturalHeight;
  canvas.width = file.naturalWidth;
  ctx.drawImage(file, 0, 0);
  const dataUrl = canvas.toDataURL();
  return dataUrl;
}
export async function imageToBase64(url) {
  const file = await loadImageFile(url);
  if (!file) {
    return;
  }
  return fileToBase64(file);
}
export function toPercent(point, total = 2) {
  if (!point) {
    return '-';
  }
  let str = Number(+(+point).toFixed(4) * 100).toFixed(total);
  str += '%';
  return str;
}
export function formatPrice(price) {
  return String(price).replaceAll(/\B(?=(\d{3})+(?!\d))/g, ',');
}
export function pushZero(num, length) {
  return (new Array(length).join('0') + num).slice(-length);
}
