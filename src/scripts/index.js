const EventHandling = {
  data() {
    return {
      message: `<webview src='` + locations[sessionStorage.getItem("currPage")] + `' id='` + sessionStorage.getItem("currPage") + `' style='width:100%; height: 100%;' allowpopups plugins></webview>`
    };
  },
  methods: {
    navigate( location ) {
      this.message = `<webview src='` + locations[location] + `' id='` + location + `' style='width:100%; height: 100%;' allowpopups plugins></webview>`;
      activeButton(location);
      sessionStorage.setItem('currPage',location)
    }
  }
}
Vue.createApp(EventHandling).mount('#home')
