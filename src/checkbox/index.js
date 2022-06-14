/**
 * @typedef {Object} Props
 *  @property {boolean} checked
 *  @property {boolean} disabled
 *  @property {() => any} onChange
 *
 */
Component({
  props: {
    checked: true,
    disabled: false,
    onChange: () => {},
  },
  didMount() {
    this._updateDataSet()
  },
  didUpdate() {
    this._updateDataSet()
  },
  methods: {
    _updateDataSet() {
      this.dataset = {}
      for (const key in this.props) {
        if (/data-/gi.test(key)) {
          this.dataset[key.replace(/data-/gi, '')] = this.props[key]
        }
      }
    },
    onChange(event) {
      const {checked, disabled} = this.props
      if (disabled) return

      const value = checked ? false : true
      event.detail = {value}
      const _onChange = this.props.onChange
      if (typeof _onChange === 'function') {
        event.target = {...event.target, dataset: this.dataset}
        _onChange(event)
      }
    },
  },
})
