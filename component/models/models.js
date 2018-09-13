
Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: ''
    },
    subTitle: {
      type: String,
      value: ''
    },
    confirmText: {
      type: String,
      value: ''
    }
  },
  data: {
    visible: false
  },
  methods: {
    closeModel: function (e) {
      this.setData({
        visible: false
      })
    }
  }
})