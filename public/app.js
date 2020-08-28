const app = new Vue({
    el: '#app',
    data: {
        url: '',
        alias: '',
        error: '',
        formVisible: true,
        created: null,
    },
    methods: {
        async createUrl() {
            this.error = '';
            const response = await fetch('/url', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    url: this.url,
                    alias: this.alias || undefined,
                })
            })
            if (response.ok) {
                const result = await response.json();
                this.formVisible = false;
                this.created = `https://nst.sh/${result.alias}`;
              } else if (response.status === 429) {
                this.error = 'Too mamy requests, try again in 30 seconds.';
              } else {
                const result = await response.json();
                this.error = result.message;
              }
        }
    }
})