<template>
  <el-container class="app-container">
    <el-header class="filter-container">
      <el-input
        v-model.trim="listQuery.name"
        placeholder="Name"
        clearable
        style="width: 180px;"
        class="filter-item"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.gender"
        placeholder="Gender"
        clearable
        style="width: 100px;"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in genderOptions"
          :key="item.key"
          :label="item.displayName"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.remindFlow"
        placeholder="RemindFlow"
        clearable
        style="width: 140px;"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in remindFlowOptions"
          :key="item.key"
          :label="item.displayName"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.remindVisit"
        placeholder="RemindVisit"
        clearable
        style="width: 140px;"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in remindVisitOptions"
          :key="item.key"
          :label="item.displayName"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.remindMedication"
        placeholder="RemindMedication"
        clearable
        style="width: 160px;"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in remindMedicationOptions"
          :key="item.key"
          :label="item.displayName"
          :value="item.key"
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
        :data="patientList"
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
        <el-table-column label="CardNo" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Gender" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.gender | genderFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Age" align="center" min-width="80">
          <template #default="{ row }">
            <span>{{ row.birth | getAge }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" width="250">
          <template #default="{ row, $index }">
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
        @pagination="getPatientList"
      />
    </el-main>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      top="8vh"
      width="750px"
      class="dialog-container"
    >
      <el-form
        ref="patientForm"
        v-loading="dialogLoading"
        :rules="rules"
        :model="tempPatient"
        label-position="left"
        label-width="100px"
        class="body-left"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="tempPatient.name" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Birth" prop="birth">
          <el-date-picker v-model="tempPatient.birth" type="date" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-select v-model="tempPatient.gender" class="filter-item" placeholder="Please input">
            <el-option
              v-for="item in genderOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Mobile">
          <el-input v-model="tempPatient.mobile" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="IdCard">
          <el-input v-model="tempPatient.idCard" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Address">
          <el-input v-model="tempPatient.address" />
        </el-form-item>
      </el-form>
      <el-upload
        class="body-right"
        action="api/v1/uploadAvatar"
        :data="{ filePath: 'patient/avatar' }"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
      >
        <img
          v-if="tempPatient.avatar"
          :src="tempPatient.avatar"
          class="avatar"
          alt="admin's avatar"
        >
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='add' ? addPatient() : updatePatient()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
const genderOptions = [
  { key: 0, displayName: '未知' },
  { key: 1, displayName: '男' },
  { key: 2, displayName: '女' }
]

const remindFlowOptions = [
  { key: 0, displayName: '已缴费' },
  { key: 1, displayName: '待缴费' }
]

const remindVisitOptions = [
  { key: 0, displayName: '无就诊' },
  { key: 1, displayName: '待就诊' }
]

const remindMedicationOptions = [
  { key: 0, displayName: '无提醒' },
  { key: 1, displayName: '已提醒' }
]

const genderTypeMap = genderOptions.reduce((prev, next) => {
  prev[next.key] = next.displayName
  return prev
}, {})

export default {
  name: 'Patient',
  filters: {
    genderFilter (gender) {
      return genderTypeMap[gender]
    },
    getAge (time) {
      if (time) {
        return new Date().getFullYear() - $dayjs(time).year()
      }
      return '未知'
    }
  },
  data () {
    return {
      patientList: [],
      total: 0,
      listLoading: false,
      dialogLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        name: '',
        gender: null,
        remindFlow: null,
        remindVisit: null,
        remindMedication: null
      },
      genderOptions,
      remindFlowOptions,
      remindVisitOptions,
      remindMedicationOptions,
      tempPatient: {
        id: null,
        name: '',
        gender: '',
        password: '',
        birth: new Date(),
        mobile: '',
        idCard: '',
        address: '',
        avatar: '',
        remindFlow: null,
        remindVisit: null,
        remindMedication: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        add: 'Add',
        update: 'Edit'
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        gender: [{ required: true, message: 'gender is required', trigger: 'change' }],
        birth: [{ required: true, message: 'birth is required', trigger: 'change' }]
      }
    }
  },
  created () {
    this.getPatientList()
  },
  methods: {
    async getPatientList () {
      this.listLoading = true

      try {
        const { total, patients } = await $api.patient.getPatientList(this.listQuery)
        this.total = total
        this.patientList = patients
      } finally {
        this.listLoading = false
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getPatientList()
    },
    resetTemp () {
      this.tempPatient = {
        id: null,
        name: '',
        gender: '',
        password: '',
        birth: new Date(),
        mobile: '',
        idCard: '',
        address: '',
        avatar: '',
        remindFlow: null,
        remindVisit: null,
        remindMedication: null
      }
    },
    handleAdd () {
      this.resetTemp()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.patientForm.clearValidate()
      })
    },
    addPatient () {
      this.$refs.patientForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { name, gender, birth, mobile, idCard, address, avatar } = this.tempPatient

          try {
            await $api.patient.addPatient({ name, gender, birth, mobile, idCard, address, avatar })

            this.patientList.push(this.tempPatient)
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
      this.tempPatient = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.patientForm.clearValidate()
      })
    },
    updatePatient () {
      this.$refs.patientForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { id, name, gender, password, birth, mobile, idCard, address, avatar, remindFlow, remindVisit, remindMedication } = this.tempPatient

          try {
            await $api.patient.updatePatient(id, { name, gender, password, birth, mobile, idCard, address, avatar, remindFlow, remindVisit, remindMedication })

            const index = this.patientList.findIndex(patient => patient.id === this.tempPatient.id)
            this.patientList.splice(index, 1, this.tempPatient)
            this.dialogFormVisible = false
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
      this.$confirm('The patient will be deleted forever, are you sure?', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await $api.patient.deletePatient(row.id)

        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.patientList.splice(index, 1)
      })
    },
    beforeAvatarUpload (file) {
      const isIMG = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isIMG) {
        this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
      }

      return isIMG && isLt1M
    },
    handleAvatarSuccess (res) {
      this.tempPatient.avatar = res.data.url
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  ::v-deep .el-dialog__body {
    display: flex;
    justify-content: space-between;
    padding: 30px 50px;

    .body-left {
      width: 470px;
    }

    .body-right {
      .avatar {
        width: 178px;
        height: 178px;
      }

      .avatar-uploader-icon {
        width: 178px;
        height: 178px;
        font-size: 28px;
        line-height: 178px;
        color: #8c939d;
        text-align: center;
        border: 1px dashed #d9d9d9;
      }
    }
  }
}
</style>
