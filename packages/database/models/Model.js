const plural = require('pluralize')
const snake = require('lodash/snake')

class Model {
  constructor(attributes) {
    this.timestamps = true
    this.primaryKey = 'id'
    this.perPage = 15
    this.syncOriginal()
    this.fill(attributes)
  }

  fill(attributes) {
    // $totallyGuarded = $this->totallyGuarded();
    // foreach ($this->fillableFromArray($attributes) as $key => $value) {
    //     $key = $this->removeTableFromKey($key);
    //     // The developers may choose to place some attributes in the "fillable" array
    //     // which means only those attributes may be set through mass assignment to
    //     // the model, and all others will just get ignored for security reasons.
    //     if ($this->isFillable($key)) {
    //         $this->setAttribute($key, $value);
    //     } elseif ($totallyGuarded) {
    //         throw new MassAssignmentException(sprintf(
    //             'Add [%s] to fillable property to allow mass assignment on [%s].',
    //             $key, get_class($this)
    //         ));
    //     }
    // }

    return this
  }

  async refresh(force) {
    if (force || this.exists === undefined) {
      this.setAttributes(await query.get(this.getKey()))

      this.syncOriginal()

      // this.exists = true
    }

    return proxy(this)
  }

  async update(attributes) {
    await this.refresh()

    if (this.exists) {
      return this.fill(attributes).save()
    }

    return false
  }

  async save() {
    const query = this.query()

    await this.refresh()

    if (this.exists) {
      return this.isDirty() ? await this.performUpdate(query) : true
    } else {
      return this.performInsert(query)
    }
  }

  async performUpdate(query) {
    if (this.timestamps) {
      await this.updateTimestamps()
    }

    const attributes = this.getDirty()

    await query.update(attributes)

    this.syncOriginal()

    return true
  }

  async performInsert(query) {
    if (this.timestamps) {
      await this.updateTimestamps()
    }

    const attributes = this.getDirty()

    await this.insertAndSetId(query, attributes)

    this.syncOriginal()

    this.exists = true

    return true
  }

  async touch() {
    if (!this.timestamps) {
      return false
    }

    await this.updateTimestamps()

    return this.save()
  }

  async updateTimestamps() {
    const time = Date.now()

    await this.refresh()

    if (!this.isDirty('updated_at')) {
      this.setAttribute('updated_at', time)
    }

    if (!this.exists && !this.isDirty('created_at')) {
      this.setAttribute('created_at', time)
    }
  }

  async insertAndSetId(query, attributes) {
    this.setAttribute(this.primaryKey, await query.insertGetId(attributes))
  }

  getKey() {
    return this.getAttribute(this.primaryKey)
  }

  getForeignKey() {
    return snake(this.constructor.name) + '_' + this.primaryKey
  }

  getTable() {
    return this.table || snake(plural(this.constructor.name))
  }

  instantiate(attributes, exists) {
    const model = new this.constructor(attributes)

    model.service = this.service
    model.exists = exists
    model.table = this.getTable()

    return proxy(model)
  }

  query() {
    return this.getService().query().setModel(this.constructor)
  }

  getService() {
    return this.constructor.manager.create(this.service)
  }

  $get(key) {
    return this.hasAttribute(key) ? this.getAttribute(key) : this.query()[key]
  }

  $set(key, value) {
    return this.setAttribute(key, value)
  }

  static query() {
    return new this().query()
  }

  static $get(key) {
    return proxy(new this())[key]
  }
}

module.exports = use(Model, [
  require('@kindling/database/models/concerns/HasAttributes'),
])
