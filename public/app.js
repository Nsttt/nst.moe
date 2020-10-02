const app = new Vue({
  el: "#app",
  data: {
    url: "",
    alias: "",
    error: "",
    images: [
      // TODO: Add Urls to original source.
      { "picture": "./images/1.png", "url": "" },
      { "picture": "./images/2.png", "url": "" },
      { "picture": "./images/3.png", "url": "" },
      { "picture": "./images/4.png", "url": "" },
      { "picture": "./images/5.png", "url": "" },
      { "picture": "./images/6.png", "url": "" },
      { "picture": "./images/7.png", "url": "" },
      { "picture": "./images/8.png", "url": "" },
      { "picture": "./images/9.png", "url": "" },
      { "picture": "./images/10.png", "url": "" },
      { "picture": "./images/11.png", "url": "" },
      { "picture": "./images/12.png", "url": "" },
      { "picture": "./images/13.png", "url": "" },
      { "picture": "./images/14.png", "url": "" },
      { "picture": "./images/15.png", "url": "" },
      { "picture": "./images/16.png", "url": "" },
      { "picture": "./images/17.png", "url": "" },
    ],
    selectedImg: null,
    selectedUrl: null,
    formVisible: true,
    created: null,
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
        this.created = `https://nst.sh/${result.alias}`;  
      } else if (response.status === 429) {
        this.error = "Too many requests, try again in 30 seconds.";
      } else {
        const result = await response.json();
        this.error = result.message;
      }
      console.log(selectedImg, selectedUrl)
    },

    getImage(imgs) {
      return imgs[Math.floor(Math.random() * this.images.length)];
    },
  },

  created(){
    const random = this.getImage(this.images)
    this.selectedImg = random.picture;
    this.selectedUrl = random.url;
  }
});
