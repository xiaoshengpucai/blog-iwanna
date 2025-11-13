// 图片数据接口定义，后续可通过axios接口获取
export interface ImageData {
  id: number;
  setUrl: string;
  url: string;
  isHero?: boolean;
}

// 当前本地图片数据，后续可替换为axios请求
// export const images: ImageData[] = [
//   { id: 1, url: "https://i.postimg.cc/9QfgTkQV/1.webp", isHero: false },
//   { id: 2, url: "https://i.postimg.cc/0yHWCCz4/2.webp", isHero: false },
//   { id: 3, url: "https://i.postimg.cc/cJgDk8Y6/3.webp", isHero: false },
//   { id: 4, url: "https://i.postimg.cc/j5CRFccP/10.jpg", isHero: false },
//   { id: 5, url: "https://i.postimg.cc/fTMM4MB6/11.png", isHero: true },
//   { id: 6, url: "https://i.postimg.cc/RCHWCC1S/12.jpg", isHero: false },
//   { id: 7, url: "https://i.postimg.cc/mrY9rLWM/5.png", isHero: false },
//   { id: 8, url: "https://i.postimg.cc/prqYL28h/6.jpg", isHero: false },
//   { id: 9, url: "https://i.postimg.cc/0NXzjbH1/7.jpg", isHero: false },
// ];
export const images: ImageData[] = [
  {
    id: 1,
    setUrl: "https://origin.picgo.net/2025/11/13/96a1f7658e3610ed7.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/96a1f7658e3610ed7.jpeg",
    isHero: false,
  },
  {
    id: 2,
    setUrl: "https://origin.picgo.net/2025/11/13/119948602d06c30ddd.th.png",
    url: "https://origin.picgo.net/2025/11/13/119948602d06c30ddd.png",
    isHero: false,
  },
  {
    id: 3,
    setUrl: "https://origin.picgo.net/2025/11/13/71f03e7489b7be84a.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/71f03e7489b7be84a.jpeg",
    isHero: false,
  },
  {
    id: 4,
    setUrl: "https://origin.picgo.net/2025/11/13/12a7800b239315b8ee.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/12a7800b239315b8ee.jpeg",
    isHero: false,
  },
  {
    id: 5,
    setUrl: "https://origin.picgo.net/2025/11/13/--b80b397f3b1e063b.th.png",
    url: "https://origin.picgo.net/2025/11/13/--b80b397f3b1e063b.png",
    isHero: false,
  },
  {
    id: 6,
    setUrl: "https://origin.picgo.net/2025/11/13/102cab7883d79dbdfc.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/102cab7883d79dbdfc.jpeg",
    isHero: false,
  },
  {
    id: 7,
    setUrl: "https://origin.picgo.net/2025/11/13/8829d47fec30e3ebd.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/8829d47fec30e3ebd.jpeg",
    isHero: false,
  },
  {
    id: 8,
    setUrl: "https://origin.picgo.net/2025/11/13/--200b186c32ec0757.th.png",
    url: "https://origin.picgo.net/2025/11/13/--200b186c32ec0757.png",
    isHero: false,
  },
  {
    id: 9,
    setUrl: "https://origin.picgo.net/2025/11/13/59565e0c132ffbd36.th.png",
    url: "https://origin.picgo.net/2025/11/13/59565e0c132ffbd36.png",
    isHero: false,
  },
  {
    id: 10,
    setUrl: "https://origin.picgo.net/2025/11/13/-28a47f10c5a6557d.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/-28a47f10c5a6557d.jpeg",
    isHero: false,
  },
  {
    id: 11,
    setUrl: "https://origin.picgo.net/2025/11/13/69c9b68e1e97a49e8.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/69c9b68e1e97a49e8.jpeg",
    isHero: false,
  },
  {
    id: 12,
    setUrl: "https://origin.picgo.net/2025/11/13/-f61f6f7f81c56919.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/-f61f6f7f81c56919.jpeg",
    isHero: false,
  },
  {
    id: 13,
    setUrl: "https://origin.picgo.net/2025/11/13/jk-jkcfe897b6460767bd.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/jk-jkcfe897b6460767bd.jpeg",
    isHero: false,
  },
  {
    id: 14,
    setUrl: "https://origin.picgo.net/2025/11/13/-1a7bd6ed105bb037.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/-1a7bd6ed105bb037.jpeg",
    isHero: false,
  },
  {
    id: 15,
    setUrl: "https://origin.picgo.net/2025/11/13/--0ce92ac2c48f9e4e.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/--0ce92ac2c48f9e4e.jpeg",
    isHero: false,
  },
  {
    id: 16,
    setUrl: "https://origin.picgo.net/2025/11/13/-b3ced651c596bc2b.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/-b3ced651c596bc2b.jpeg",
    isHero: false,
  },
  {
    id: 17,
    setUrl: "https://origin.picgo.net/2025/11/13/jk--a4bfaa9322961ff5.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/jk--a4bfaa9322961ff5.jpeg",
    isHero: false,
  },
  {
    id: 18,
    setUrl: "https://origin.picgo.net/2025/11/13/-49d861d17d70252b.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/-49d861d17d70252b.jpeg",
    isHero: false,
  },
  {
    id: 19,
    setUrl: "https://origin.picgo.net/2025/11/13/-293e3740d9116a1d.th.jpeg",
    url: "https://origin.picgo.net/2025/11/13/-293e3740d9116a1d.jpeg",
    isHero: false,
  },
  {
    id: 20,
    setUrl: "https://origin.picgo.net/2025/11/13/3a8320f1cb0ea014d.th.webp",
    url: "https://origin.picgo.net/2025/11/13/3a8320f1cb0ea014d.webp",
    isHero: false,
  },
  {
    id: 21,
    setUrl: "https://origin.picgo.net/2025/11/13/5f46b5c18735ce0a9.th.webp",
    url: "https://origin.picgo.net/2025/11/13/5f46b5c18735ce0a9.webp",
    isHero: false,
  },
  {
    id: 22,
    setUrl: "https://origin.picgo.net/2025/11/13/234bf93635b701e58.th.webp",
    url: "https://origin.picgo.net/2025/11/13/234bf93635b701e58.webp",
    isHero: false,
  },
  {
    id: 23,
    setUrl: "https://origin.picgo.net/2025/11/13/18d484d6afc766fd7.th.webp",
    url: "https://origin.picgo.net/2025/11/13/18d484d6afc766fd7.webp",
    isHero: false,
  },
  {
    id: 24,
    setUrl: "https://origin.picgo.net/2025/11/13/78aa42f921553248f.th.webp",
    url: "https://origin.picgo.net/2025/11/13/78aa42f921553248f.webp",
    isHero: false,
  },
];

// // 辅助函数：获取图片数据的函数，后续可替换为axios请求
// export const fetchImages = async (): Promise<ImageData[]> => {
//   // 模拟异步请求
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(images);
//     }, 100);
//   });
// };



export interface imagesDataToSecondScreen {
  rows: ImageData[][];
}

// 统一的图片数据存储，便于后续接口获取和更新
export const imagesDataToSecondScreen = {
  // 图片网格数据 - 每行2-5个图片，共4行
  rows: [
    // 第一行：5个图片位置
    [
      "https://origin.picgo.net/2025/11/13/119948602d06c30ddd.png",
      null,
      "https://origin.picgo.net/2025/11/13/12a7800b239315b8ee.jpeg",
      null,
      "https://origin.picgo.net/2025/11/13/--b80b397f3b1e063b.png",
    ],
    // 第二行：4个图片位置
    [
      null,
      "https://origin.picgo.net/2025/11/13/-293e3740d9116a1d.jpeg",
      "https://origin.picgo.net/2025/11/13/-b3ced651c596bc2b.jpeg",
      null,
    ],
    // 第三行：3个图片位置
    [
      "https://origin.picgo.net/2025/11/13/--0ce92ac2c48f9e4e.jpeg",
      "https://origin.picgo.net/2025/11/13/jk-jkcfe897b6460767bd.jpeg",
      null,
    ],
    // 第四行：4个图片位置
    [
      null,
      "https://origin.picgo.net/2025/11/13/-f61f6f7f81c56919.jpeg",
      null,
      "https://origin.picgo.net/2025/11/13/69c9b68e1e97a49e8.jpeg",
    ],
  ],
};

// 为模板渲染提供的图片行数据引用

// 未来可通过此函数从接口更新图片数据
export const updateImagesFromApi = async () => {
  // 这里将替换为实际的API调用
  // const response = await fetch('/api/images');
  // const data = await response.json();
  // imagesData.value = data;
  // imageRows.value = imagesData.value.rows;
};
