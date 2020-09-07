const numRand = Math.floor(Math.random() * 11);

const app = new Vue({
  el: "#app",
  data: {
    url: "",
    alias: "",
    error: "",
    number: numRand,
    formVisible: true,
    created: null,
  },
  methods: {
    addSource() {
      switch (numRand) {
        default:
          break;
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        case 4:
          break;
        case 5:
          break;
        case 6:
          break;
        case 7:
          break;
        case 8:
          break;
        case 9:
          break;
        case 10:
          break;
        case 11:
          break;
      }
    },

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
        this.error = "Too mamy requests, try again in 30 seconds.";
      } else {
        const result = await response.json();
        this.error = result.message;
      }
    },
  },
});

const getRandomImage = () => {
  document.getElementById("img").srcset = "./images/" + numRand + ".png";
};
getRandomImage();
