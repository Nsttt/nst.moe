import { createApp } from "https://unpkg.com/vue@3/dist/vue.esm-browser.prod.js";

createApp({
  data() {
    return {
      url: "",
      alias: "",
      error: "",
      images: [
        { picture: "./images/1.png", url: "" },
        {
          picture: "./images/2.png",
          url: "https://www.pixiv.net/en/artworks/75245157",
        },
        {
          picture: "./images/3.png",
          url: "https://www.pixiv.net/en/artworks/77599104",
        },
        {
          picture: "./images/4.png",
          url: "https://www.pixiv.net/en/artworks/74424052",
        },
        {
          picture: "./images/5.png",
          url: "https://www.pixiv.net/en/artworks/83018302",
        },
        {
          picture: "./images/6.png",
          url: "https://www.pixiv.net/en/artworks/84144165",
        },
        {
          picture: "./images/7.png",
          url: "https://twitter.com/kaokanah/status/1293896768300564482",
        },
        {
          picture: "./images/8.png",
          url: "https://www.pixiv.net/en/artworks/84638508",
        },
        {
          picture: "./images/9.png",
          url: "https://gelbooru.com/index.php?page=post&s=view&id=3105959",
        },
        {
          picture: "./images/10.png",
          url: "https://www.pixiv.net/en/artworks/78931130",
        },
        {
          picture: "./images/11.png",
          url: "https://www.pixiv.net/en/artworks/44335776",
        },
        {
          picture: "./images/12.png",
          url: "https://www.pixiv.net/en/artworks/64384377",
        },
        {
          picture: "./images/13.png",
          url: "https://www.pixiv.net/en/artworks/81297900",
        },
        {
          picture: "./images/14.png",
          url: "https://www.pixiv.net/en/artworks/84092367",
        },
        {
          picture: "./images/15.png",
          url: "https://twitter.com/nistick023/status/1281965257070505984",
        },
        {
          picture: "./images/16.png",
          url: "https://www.pixiv.net/en/artworks/83533176",
        },
        {
          picture: "./images/17.png",
          url: "https://www.pixiv.net/en/artworks/83609697",
        },
      ],
      selectedImg: null,
      selectedUrl: null,
      formVisible: true,
      created: null,
    };
  },
  methods: {
    async createUrl() {
      this.error = "";

      const response = await fetch("/url", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url: this.url,
          alias: this.alias || undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        this.formVisible = false;
        this.created = `https://nst.moe/${result.alias}`;
      } else if (response.status === 429) {
        this.error = "Too many requests, try again in 30 seconds.";
      } else if (response.status === 500) {
        this.error = "Alias already in use.";
      } else {
        const result = await response.json();
        this.error = result.message;
      }
    },

    getImage(imgs) {
      return imgs[Math.floor(Math.random() * this.images.length)];
    },
  },

  created() {
    const random = this.getImage(this.images);
    this.selectedImg = random.picture;
    this.selectedUrl = random.url;
  },
}).mount("#app");
