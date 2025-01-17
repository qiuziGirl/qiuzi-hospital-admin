<template>
  <el-container class="app-container">
    <el-header class="filter-container">
      <el-input
        v-model.trim="listQuery.patientName"
        placeholder="Patient Name"
        clearable
        style="width: 200px;"
        class="filter-item"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model.trim="listQuery.doctorName"
        placeholder="Doctor Name"
        clearable
        style="width: 200px;"
        class="filter-item"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.date"
        type="date"
        clearable
        placeholder="Pick a date"
        style="width: 150px;"
        class="filter-item"
        @clear="handleFilter"
        @change="handleFilter"
      />
      <el-select
        v-model="listQuery.change"
        placeholder="Change"
        clearable
        style="width: 130px;"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option label="No" :value="0" />
        <el-option label="Yes" :value="1" />
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 15px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
    </el-header>

    <el-main>
      <el-table
        v-loading="listLoading"
        :data="recordList"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          label="ID"
          align="center"
          type="index"
          width="70"
        />
        <el-table-column label="PatientName" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.patientName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CardNo" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.cardNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Department" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="DoctorName" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.doctorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Date" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
      </el-table>

      <qz-pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getRecordList"
      />
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Record',
  data () {
    return {
      recordList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        date: '',
        doctorName: '',
        patientName: '',
        change: null
      }
    }
  },
  created () {
    this.getRecordList()
  },
  methods: {
    async getRecordList () {
      this.listLoading = true

      try {
        const { total, records } = await $api.record.getRecordList(this.listQuery)

        this.total = total
        this.recordList = records
      } finally {
        this.listLoading = false
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getRecordList()
    }
  }
}
</script>
