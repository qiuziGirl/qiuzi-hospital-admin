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
        v-model="listQuery.department"
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
          :value="item.name"
        />
      </el-select>
      <el-button
        class="filter-item"
        type="primary"
        style="margin-left: 15px;"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        class="filter-item"
        type="primary"
        style="margin-left: 10px;"
        icon="el-icon-edit"
        @click="handleAdd"
      >
        Add
      </el-button>
    </el-header>

    <el-main>
      <el-table
        v-loading="listLoading"
        :data="doctorList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="ID"
          align="center"
          type="index"
          width="70"
        />
        <el-table-column label="DoctorId" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.doctorId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Name" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Gender" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.gender | genderFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Department" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.department }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Duty" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.duty }}</span>
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
        @pagination="getDoctorList"
      />
    </el-main>

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="750px"
      class="dialog-container"
    >
      <el-form
        ref="doctorForm"
        v-loading="dialogLoading"
        :rules="rules"
        :model="tempDoctor"
        label-position="left"
        label-width="100px"
        class="body-left"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="tempDoctor.name" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="DoctorId" prop="doctorId">
          <el-input v-model="tempDoctor.doctorId" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Birth" prop="birth">
          <el-date-picker v-model="tempDoctor.birth" type="date" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="Duty" prop="duty">
          <el-input v-model="tempDoctor.duty" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Rank" prop="rank">
          <el-input v-model="tempDoctor.rank" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Gender" prop="gender">
          <el-select v-model="tempDoctor.gender" class="filter-item" placeholder="Please input">
            <el-option
              v-for="item in genderOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Department" prop="department">
          <el-select v-model="tempDoctor.department" class="filter-item" placeholder="Please input">
            <el-option
              v-for="item in departmentOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Mobile" prop="mobile">
          <el-input v-model="tempDoctor.mobile" style="width: 220px;" />
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="tempDoctor.address" />
        </el-form-item>
        <el-form-item label="Introduce">
          <el-input v-model="tempDoctor.introduce" type="textarea" />
        </el-form-item>
      </el-form>

      <el-upload
        class="body-right"
        action="api/v1/uploadAvatar"
        :data="{ filePath: 'doctor/avatar' }"
        :show-file-list="false"
        :before-upload="beforeAvatarUpload"
        :on-success="handleAvatarSuccess"
      >
        <img
          v-if="tempDoctor.avatar"
          :src="tempDoctor.avatar"
          class="avatar"
          alt="admin's avatar"
        >
        <i v-else class="el-icon-plus avatar-uploader-icon" />
      </el-upload>

      <div slot="footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='add' ? addDoctor() : updateDoctor()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { validMobile } from '@/utils/validate'

const genderOptions = [
  { key: 0, displayName: '未知' },
  { key: 1, displayName: '男' },
  { key: 2, displayName: '女' }
]

const genderTypeMap = genderOptions.reduce((prev, next) => {
  prev[next.key] = next.displayName
  return prev
}, {})

export default {
  name: 'Doctor',
  filters: {
    genderFilter (gender) {
      return genderTypeMap[gender]
    }
  },
  data () {
    const validateMobile = (rule, value, callback) => {
      if (!validMobile(value)) {
        callback(new Error('Please enter the correct phone number'))
      } else {
        callback()
      }
    }
    return {
      doctorList: [],
      total: 0,
      listLoading: false,
      dialogLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        name: '',
        gender: null,
        department: ''
      },
      genderOptions,
      departmentOptions: [],
      departmentKeyMap: null,
      tempDoctor: {
        id: '',
        name: '',
        gender: 1,
        rank: '',
        duty: '',
        doctorId: '',
        mobile: '',
        address: '',
        avatar: '',
        introduce: '',
        birth: new Date(),
        department: '',
        departmentId: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        add: 'Add',
        update: 'Edit'
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        doctorId: [{ required: true, message: 'doctorID is required', trigger: 'blur' }],
        gender: [{ required: true, message: 'gender is required', trigger: 'change' }],
        birth: [{ required: true, message: 'birth is required', trigger: 'change' }],
        mobile: [{ required: true, trigger: ['blur', 'change'], validator: validateMobile }],
        address: [{ required: true, message: 'address is required', trigger: 'blur' }],
        duty: [{ required: true, message: 'duty is required', trigger: 'blur' }],
        rank: [{ required: true, message: 'rank is required', trigger: 'blur' }],
        department: [{ required: true, message: 'department is required', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getDoctorList()
    this.getDepartmentList()
  },
  methods: {
    async getDoctorList () {
      this.listLoading = true

      try {
        const { total, doctors } = await $api.doctor.getDoctorList(this.listQuery)
        this.total = total
        this.doctorList = doctors
      } finally {
        this.listLoading = false
      }
    },
    async getDepartmentList () {
      this.listLoading = true

      try {
        const { departments } = await $api.department.getDepartmentList()
        this.departmentOptions = departments

        this.departmentKeyMap = this.departmentOptions.reduce((prev, next) => {
          prev[next.name] = next.id
          return prev
        }, {})
      } finally {
        this.listLoading = false
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getDoctorList()
    },
    resetTemp () {
      this.tempDoctor = {
        id: '',
        name: '',
        gender: 1,
        rank: '',
        duty: '',
        doctorId: '',
        address: '',
        avatar: '',
        introduce: '',
        birth: new Date(),
        department: '',
        departmentId: null
      }
    },
    handleAdd () {
      this.resetTemp()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.doctorForm.clearValidate()
      })
    },
    addDoctor () {
      this.$refs.doctorForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          this.tempDoctor.departmentId = this.departmentKeyMap[this.tempDoctor.department]
          const { name, doctorId, gender, birth, mobile, address, duty, rank, introduce, department, departmentId, avatar } = this.tempDoctor

          try {
            await $api.doctor.addDoctor({ name, doctorId, gender, birth, mobile, address, duty, rank, introduce, department, departmentId, avatar })

            this.doctorList.push(this.tempDoctor)
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
      this.tempDoctor = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.doctorForm.clearValidate()
      })
    },
    updateDoctor () {
      this.$refs.doctorForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const tempData = Object.assign({}, this.tempDoctor)
          tempData.departmentId = this.departmentKeyMap[tempData.department]
          const { id, name, doctorId, gender, birth, mobile, address, duty, rank, introduce, department, departmentId, avatar } = tempData

          try {
            await $api.doctor.updateDoctor(id, { name, doctorId, gender, birth, mobile, address, duty, rank, introduce, department, departmentId, avatar })

            const index = this.doctorList.findIndex(doctor => doctor.id === this.tempDoctor.id)
            this.doctorList.splice(index, 1, this.tempDoctor)
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
      this.$confirm('The doctor will be deleted forever, are you sure?', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await $api.doctor.deleteDoctor(row.id)

        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.doctorList.splice(index, 1)
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
      this.tempDoctor.avatar = res.data.url
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-container {
  /deep/ .el-dialog__body {
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
