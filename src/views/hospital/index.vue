<template>
  <el-container class="app-container">
    <el-header class="filter-container">
      <el-input
        v-model.trim="listQuery.name"
        placeholder="Name"
        clearable
        style="width: 200px;"
        class="filter-item"
        @clear="handleFilter"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.level"
        placeholder="Level"
        clearable
        style="width: 90px;"
        class="filter-item"
        @change="handleFilter"
        @clear="handleFilter"
      >
        <el-option
          v-for="item in levelOptions"
          :key="item.key"
          :label="item.displayName"
          :value="item.key"
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
        :data="hospitalList"
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
        <el-table-column label="Name" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Manager" align="center" min-width="80">
          <template v-slot="{ row }">
            <span>{{ row.manager }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Level" align="center" width="100">
          <template v-slot="{ row }">
            <span>{{ row.level | levelFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Address" align="center" min-width="100">
          <template v-slot="{ row }">
            <span>{{ row.address }}</span>
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
        @pagination="getHospitalList"
      />
    </el-main>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="620px">
      <el-form
        ref="hospitalForm"
        v-loading="dialogLoading"
        :rules="rules"
        :model="tempHospital"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left: 50px;"
      >
        <el-form-item label="Level" prop="level">
          <el-select v-model="tempHospital.level" class="filter-item" placeholder="Please select">
            <el-option
              v-for="item in levelOptions"
              :key="item.key"
              :label="item.displayName"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="tempHospital.name" />
        </el-form-item>
        <el-form-item label="Manager" prop="manager">
          <el-input v-model="tempHospital.manager" />
        </el-form-item>
        <el-form-item label="Tel" prop="tel">
          <el-input v-model="tempHospital.tel" />
        </el-form-item>
        <el-form-item label="Address" prop="address">
          <el-input v-model="tempHospital.address" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='add' ? addHospital() : updateHospital()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
const levelOptions = [
  { key: 1, displayName: '三甲' },
  { key: 2, displayName: '三乙' },
  { key: 3, displayName: '二甲' }
]

const levelTypeMap = levelOptions.reduce((prev, next) => {
  prev[next.key] = next.displayName
  return prev
}, {})

export default {
  name: 'Hospital',
  filters: {
    levelFilter (level) {
      return levelTypeMap[level]
    }
  },
  data () {
    return {
      hospitalList: [],
      total: 0,
      listLoading: false,
      dialogLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        name: '',
        level: null
      },
      levelOptions,
      tempHospital: {
        id: '',
        name: '',
        level: '',
        manager: '',
        tel: '',
        address: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        add: 'Add',
        update: 'Edit'
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        manager: [{ required: true, message: 'manager is required', trigger: 'blur' }],
        tel: [{ required: true, message: 'tel is required', trigger: 'blur' }],
        address: [{ required: true, message: 'address is required', trigger: 'blur' }],
        level: [{ required: true, message: 'role is required', trigger: 'change' }]
      }
    }
  },
  created () {
    this.getHospitalList()
  },
  methods: {
    async getHospitalList () {
      this.listLoading = true

      try {
        const { hospitals, total } = await $api.hospital.getHospitalList(this.listQuery)
        this.total = total
        this.hospitalList = hospitals
      } finally {
        this.listLoading = false
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getHospitalList()
    },
    resetTempHospital () {
      this.tempHospital = {
        id: '',
        name: '',
        level: '',
        manager: '',
        tel: '',
        address: ''
      }
    },
    handleAdd () {
      this.resetTempHospital()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.hospitalForm.clearValidate()
      })
    },
    addHospital () {
      this.$refs.hospitalForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { name, level, manager, tel, address } = this.tempHospital

          try {
            await $api.hospital.addHospital({ name, level, manager, tel, address })

            this.hospitalList.push(this.tempHospital)
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
      this.tempHospital = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.hospitalForm.clearValidate()
      })
    },
    updateHospital () {
      this.$refs.hospitalForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { id, name, level, manager, tel, address } = this.tempHospital

          try {
            await $api.hospital.updateHospital(id, { name, level, manager, tel, address })

            const index = this.hospitalList.findIndex(hospital => hospital.id === this.tempHospital.id)
            this.hospitalList.splice(index, 1, this.tempHospital)
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
      this.$confirm('The hospital will be deleted forever, are you sure?', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await $api.hospital.deleteHospital(row.id)

        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.hospitalList.splice(index, 1)
      })
    }
  }
}
</script>
