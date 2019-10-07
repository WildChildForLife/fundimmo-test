<template>
  <div class="list-countries">
      <b-table striped hover :items="items"></b-table>
  </div>
</template>

<script>
import InertiaTable from 'inertia-table'

export default {
  name: 'Countries',
  components: {
    InertiaTable,
  },
  props: ['countries', 'filters', 'order'],
    data() {
        return {
            items: [
                { age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
                { age: 21, first_name: 'Larsen', last_name: 'Shaw' },
                { age: 89, first_name: 'Geneva', last_name: 'Wilson' },
                { age: 38, first_name: 'Jami', last_name: 'Carney' }
            ]
        }
    },
  methods: {
    show(country) {
      this.$inertia.replace(this.route('countries.edit', country.id));
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
