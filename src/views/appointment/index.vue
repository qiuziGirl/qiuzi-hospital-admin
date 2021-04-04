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
      <el-date-picker
        v-model="listQuery.date"
        type="date"
        clearable
        placeholder="Pick a date"
        style="width: 130px;"
        class="filter-item"
        @clear="handleFilter"
        @change="handleFilter"
      />
      <el-select
        v-model="listQuery.departmentId"
        placeholder="Department"
        clearable
        style="width: 130px;"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in departmentOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="Status"
        clearable
        style="width: 130px;"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.key"
          :label="item.displayName"
          :value="item.key"
        />
      </el-select>
      <el-button
        v-waves
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
        :data="appointmentList"
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
          <template v-slot="{ row }">
            <span>{{ row.patientName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="CardNo" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.cardNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Department" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Doctor" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.doctorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Date" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
      </el-table>

      <qz-pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getAppointmentList"
      />
    </el-main>
  </el-container>
</template>

<script>
const statusOptions = [
  { key: 0, displayName: '未就诊' },
  { key: 1, displayName: '已就诊' },
  { key: -1, displayName: '已失效' }
]

export default {
  name: 'Appointment',
  data () {
    return {
      appointmentList: [],
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        date: '',
        departmentId: null,
        patientName: '',
        cancel: null,
        status: 0
      },
      statusOptions,
      departmentOptions: [],
      departmentTypeMap: null
    }
  },
  created () {
    this.getAppointmentList()
    this.getDepartmentList()
  },
  methods: {
    async getAppointmentList () {
      this.listLoading = true

      try {
        const { total, appointments } = await $api.appointment.getAppointmentList(this.listQuery)

        this.total = total
        this.appointmentList = appointments
      } finally {
        this.listLoading = false
      }
    },
    async getDepartmentList () {
      this.listLoading = true

      try {
        const { departments } = await $api.department.getDepartmentList()

        this.departmentOptions = departments
        this.departmentTypeMap = this.departmentOptions.reduce((prev, next) => {
          prev[next.name] = next.id
          return prev
        }, {})
      } finally {
        this.listLoading = false
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getAppointmentList()
    }
  }
}
</script>
