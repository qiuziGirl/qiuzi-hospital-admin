<template>
  <el-container class="app-container">
    <el-header class="filter-container">
      <el-input
        v-model.trim="listQuery.doctorName"
        placeholder="Doctor Name"
        clearable
        style="width: 180px;"
        class="filter-item"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />
      <el-date-picker
        v-model="listQuery.date"
        type="date"
        placeholder="Pick a date"
        class="filter-item"
        @change="handleFilter"
      />
      <el-select
        v-model="listQuery.departmentId"
        placeholder="Department"
        clearable
        style="width: 130px;"
        class="filter-item"
        @clear="handleFilter"
        @change="handleFilter"
      >
        <el-option
          v-for="item in departmentOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="listQuery.isRemaining"
        placeholder="Order Status"
        clearable
        style="width: 140px;"
        class="filter-item"
        @clear="handleFilter"
        @change="handleFilter"
      >
        <el-option
          v-for="item in orderOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
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
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
      >
        Add
      </el-button>
    </el-header>

    <el-main>
      <el-table
        v-loading="listLoading"
        :data="workPlanList"
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
        <el-table-column label="Department" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.departmentId | departmentFilter(departmentTypeMap) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Doctor Name" align="center">
          <template v-slot="{ row }">
            <span>{{ row.doctorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Type" align="center">
          <template v-slot="{ row }">
            <span>{{ row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Remaining" align="center">
          <template v-slot="{ row }">
            <span>{{ row.remainingNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sum" align="center">
          <template v-slot="{ row }">
            <span>{{ row.maxAppointmentNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Date" align="center">
          <template v-slot="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" width="250">
          <template v-slot="{ row, $index }">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              Edit
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(row, $index)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <qz-pagination
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getWorkPlanList"
      />
    </el-main>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      top="5vh"
      width="550px"
    >
      <el-form
        ref="workPlanForm"
        v-loading="dialogLoading"
        :model="tempWorkPlan"
        :rules="rules"
        label-position="left"
        label-width="100px"
        style="width: 400px; margin-left: 50px;"
      >
        <el-form-item label="Date" prop="date">
          <el-date-picker
            v-model="tempWorkPlan.date"
            type="date"
            placeholder="Please pick a date"
          />
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select v-model="tempWorkPlan.type">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="House" prop="house">
          <el-input v-model="tempWorkPlan.house" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="MaxNum" prop="maxAppointmentNum">
          <el-input
            v-model.number="tempWorkPlan.maxAppointmentNum"
            :disabled="dialogStatus === 'update'"
            style="width: 220px;"
          />
        </el-form-item>
        <el-form-item label="Department" prop="departmentId">
          <el-select v-model="tempWorkPlan.departmentId" @change="changeDepartment">
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Doctor" prop="doctorName">
          <el-select v-model="tempWorkPlan.doctorName">
            <el-option
              v-for="item in doctorOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="StartTime" prop="startTime">
          <el-time-select
            v-model="tempWorkPlan.startTime"
            :clearable="false"
            :picker-options="{ start: '08:00', step: '00:30', end: '18:00' }"
            @change="tempWorkPlan.endTime = ''"
          />
        </el-form-item>
        <el-form-item label="EndTime" prop="endTime">
          <el-time-select
            v-model="tempWorkPlan.endTime"
            :picker-options="{ start: '08:30', step: '00:30', end: '18:30', minTime: tempWorkPlan.startTime, maxTime}"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='add' ? addWorkPlan() : updateWorkPlan()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { addTime } from '@/utils'

const typeOptions = [
  { label: '平诊', value: '平诊' },
  { lable: '专家', value: '专家' }
]

const orderOptions = [
  { label: '可预约', value: 1 },
  { label: '不可预约', value: 0 }
]

export default {
  name: 'WorkPlan',
  filters: {
    departmentFilter (departmentId, departmentTypeMap) {
      return departmentTypeMap[departmentId]
    }
  },
  data () {
    return {
      workPlanList: [],
      total: 0,
      listLoading: false,
      dialogLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        date: null,
        isRemaining: 1,
        doctorName: '',
        departmentId: null
      },
      typeOptions,
      orderOptions,
      departmentOptions: [],
      doctorOptions: [],
      departmentTypeMap: null,
      doctorKeyValue: null,
      tempWorkPlan: {
        id: null,
        date: new Date(),
        stopReason: '',
        temp: null,
        creater: null,
        house: '',
        maxAppointmentNum: 3,
        addNumCreater: null,
        type: '平诊',
        departmentId: 1,
        doctorId: null,
        doctorName: '',
        startTime: '09:00',
        endTime: '',
        stop: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        add: 'Add',
        update: 'Edit'
      },
      rules: {
        date: [{ type: 'date', required: true, message: 'date is required', trigger: 'change' }],
        type: [{ required: true, message: 'type is required', tirgger: 'change' }],
        house: [{ required: true, message: 'house is required', tirgger: 'blur' }],
        departmentId: [{ type: 'number', required: true, message: 'department is required', tirgger: 'change' }],
        doctorName: [{ required: true, message: 'doctor is required', tirgger: 'change' }],
        startTime: [{ required: true, message: 'startTime is required', tirgger: 'change' }],
        endTime: [{ required: true, message: 'endTime is required', tirgger: 'change' }],
        maxAppointmentNum: [
          { required: true, message: 'maxNum is required' },
          { type: 'number', message: 'maxNum must be required' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['id']),
    maxTime () {
      return addTime(this.tempWorkPlan.startTime, '01:00')
    }
  },
  created () {
    this.getDepartmentList()
    this.getDoctorList()
    this.getWorkPlanList()
  },
  methods: {
    async getWorkPlanList () {
      this.listLoading = true

      try {
        const { total, workPlans } = await $api.workPlan.getWorkPlanList(this.listQuery)

        this.total = total
        this.workPlanList = workPlans
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
          prev[next.id] = next.name
          return prev
        }, {})
      } finally {
        this.listLoading = false
      }
    },
    async getDoctorList () {
      this.listLoading = true

      try {
        const { doctors } = await $api.doctor.getDoctorList({ departmentId: this.tempWorkPlan.departmentId })

        this.doctorOptions = doctors
        this.doctorKeyValue = this.doctorOptions.reduce((prev, next) => {
          prev[next.name] = next.doctorId
          return prev
        }, {})
      } finally {
        this.listLoading = false
      }
    },
    changeDepartment () {
      this.tempWorkPlan.doctorName = ''
      this.getDoctorList()
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getWorkPlanList()
    },
    resetTemp () {
      this.tempWorkPlan = {
        id: null,
        date: new Date(),
        stopReason: '',
        temp: null,
        creater: null,
        house: '',
        maxAppointmentNum: 3,
        addNumCreater: null,
        type: '平诊',
        departmentId: 1,
        doctorId: null,
        doctorName: '',
        startTime: '09:00',
        endTime: '',
        stop: null
      }
    },
    handleAdd () {
      this.resetTemp()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.workPlanForm.clearValidate()
      })
    },
    addWorkPlan () {
      this.$refs.workPlanForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          this.tempWorkPlan.doctorId = this.doctorKeyValue[this.tempWorkPlan.doctorName]
          const { date, house, maxAppointmentNum, type, departmentId, doctorId, doctorName, startTime: tempStartTime, endTime: tempEndTime } = this.tempWorkPlan
          const startTime = $dayjs(date).hour(Number.parseInt(tempStartTime.split(':')[0])).minute(Number.parseInt(tempStartTime.split(':')[1])).second(0).format('YYYY-MM-DD HH:mm:ss')
          const endTime = $dayjs(date).hour(Number.parseInt(tempEndTime.split(':')[0])).minute(Number.parseInt(tempEndTime.split(':')[1])).second(0).format('YYYY-MM-DD HH:mm:ss')

          try {
            await $api.workPlan.addWorkPlan({
              date,
              creater: this.id,
              house,
              maxAppointmentNum,
              type,
              departmentId,
              doctorId,
              doctorName,
              startTime,
              endTime
            })

            this.getWorkPlanList()
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Add Successfully',
              type: 'success',
              duration: 2000
            })
          } finally {
            this.dialogLoading = false
          }
        }
      })
    },
    handleUpdate (row) {
      this.tempWorkPlan = Object.assign({}, row)
      this.tempWorkPlan.date = new Date(this.tempWorkPlan.date)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.workPlanForm.clearValidate()
      })
    },
    updateWorkPlan () {
      this.$refs.workPlanForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { id, date, stopReason, temp, house, maxAppointmentNum, addNumCreater, type, departmentId, doctorId, startTime: tempStartTime, endTime: tempEndTime, stop } = this.tempWorkPlan
          const startTime = $dayjs(date).hour(Number.parseInt(tempStartTime.split(':')[0])).minute(Number.parseInt(tempStartTime.split(':')[1])).second(0).format('YYYY-MM-DD HH:mm:ss')
          const endTime = $dayjs(date).hour(Number.parseInt(tempEndTime.split(':')[0])).minute(Number.parseInt(tempEndTime.split(':')[1])).second(0).format('YYYY-MM-DD HH:mm:ss')

          try {
            await $api.workPlan.updateWorkPlan(id, {
              stopReason,
              temp,
              creater: this.id,
              house,
              maxAppointmentNum,
              addNumCreater,
              type,
              departmentId,
              doctorId,
              startTime,
              endTime,
              stop
            })

            this.dialogFormVisible = false
            this.getWorkPlanList()
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          } finally {
            this.dialogLoading = false
          }
        }
      })
    },
    handleDelete (row, index) {
      this.$confirm('The workPlan will be deleted forever, are you sure?', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await $api.workPlan.deleteWorkPlan(row.id)

        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.workPlanList.splice(index, 1)
      })
    }
  }
}
</script>
