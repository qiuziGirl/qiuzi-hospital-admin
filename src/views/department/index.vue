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
      <el-button
        style="margin-left: 15px;"
        class="filter-item"
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
        :data="departmentList"
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
          <template #default="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Introduce" align="center" min-width="100">
          <template #default="{ row }">
            <span class="department-introduce">{{ row.introduce }}</span>
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
        @pagination="getDepartmentList"
      />
    </el-main>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="620px">
      <el-form
        ref="departmentForm"
        v-loading="dialogLoading"
        :rules="rules"
        :model="tempDepartment"
        label-position="left"
        label-width="90px"
        style="width: 480px; margin-left: 50px;"
      >
        <el-form-item label="Name" prop="name">
          <el-input v-model="tempDepartment.name" />
        </el-form-item>
        <el-form-item label="Introduce" prop="introduce">
          <el-input
            v-model="tempDepartment.introduce"
            type="textarea"
            :rows="4"
            maxlength="380"
            placeholder="Please enter introduce"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='add' ? addDepartment() : updateDepartment()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'Department',
  data () {
    return {
      departmentList: [],
      total: 0,
      listLoading: true,
      dialogLoading: false,
      listQuery: {
        page: 1,
        limit: 15,
        name: ''
      },
      tempDepartment: {
        id: '',
        name: '',
        introduce: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        add: 'Add',
        update: 'Edit'
      },
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        introduce: [{ required: true, message: 'introduce is required', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getDepartmentList()
  },
  methods: {
    async getDepartmentList () {
      this.listLoading = true

      try {
        const { departments, total } = await $api.department.getDepartmentList(this.listQuery)
        this.departmentList = departments
        this.total = total
      } finally {
        this.listLoading = false
      }
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getDepartmentList()
    },
    resetTempDepartment () {
      this.tempDepartment = {
        id: '',
        name: '',
        introduce: ''
      }
    },
    handleAdd () {
      this.resetTempDepartment()
      this.dialogStatus = 'add'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.departmentForm.clearValidate()
      })
    },
    addDepartment () {
      this.$refs.departmentForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { name, introduce } = this.tempDepartment

          try {
            await $api.department.addDepartment({ name, introduce })

            this.departmentList.push(this.tempDepartment)
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
      this.tempDepartment = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.departmentForm.clearValidate()
      })
    },
    updateDepartment () {
      this.$refs.departmentForm.validate(async valid => {
        if (valid) {
          this.dialogLoading = true
          const { id, name, introduce } = this.tempDepartment

          try {
            await $api.department.updateDepartment(id, { name, introduce })

            const index = this.departmentList.findIndex(department => department.id === this.tempDepartment.id)
            this.departmentList.splice(index, 1, this.tempDepartment)
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
      this.$confirm('The department will be deleted forever, are you sure?', 'Tips', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async () => {
        await $api.department.deleteDepartment(row.id)

        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })

        this.departmentList.splice(index, 1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department-introduce {
  padding-right: 30px;
  padding-left: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
