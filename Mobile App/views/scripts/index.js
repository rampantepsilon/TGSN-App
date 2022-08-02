const EventHandling = {
  data() {
    return {
      message: `<iframe src='` + locations[sessionStorage.getItem("currPage")] + `' id='` + sessionStorage.getItem("currPage") + `' style='width:100%; height: 100%;' allowpopups plugins></iframe>`
    };
  },
  methods: {
    navigate( location ) {
      this.message = `<iframe src='` + locations[location] + `' id='` + location + `' style='width:100%; height: 100%;' allowpopups plugins></iframe>`;
      activeButton(location);
      sessionStorage.setItem('currPage',location)
    }
  }
}
Vue.createApp(EventHandling).mount('#home')
