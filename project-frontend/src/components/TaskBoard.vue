<template>
	<div>
		<div v-if="loading">Loading...</div>
		<div v-if="error">{{ error }}</div>
		<div v-else>
			<div class="project-list">
				<h2>Projects</h2>
				<ul>
					<li v-for="project in projects" :key="project.id" @click="selectProject(project.id)">
						{{ project.name }}
					</li>
				</ul>
				<form @submit.prevent="createProject">
					<input v-model="newProject.name" placeholder="New Project Name" required />
					<button type="submit">Create Project</button>
				</form>
			</div>
			<div class="task-columns">
				<div v-for="status in statuses" :key="status" :data-status="status">
					<h3>{{ statusLabels[status] }}</h3>
					<draggable :list="tasksByStatus(status)" @end="onEnd"> // bug
						<template #item="{ element }">
							<TaskCard v-for="task in tasksByStatus[status]" :key="task.id" :task="element"
								@edit-task="editTask" />
						</template>
					</draggable>
				</div>
			</div>
			<form @submit.prevent="createTask">
				<input v-model="newTask.title" placeholder="Task Title" required />
				<select v-model="newTask.status" required>
					<option v-for="status in statuses" :key="status" :value="status">{{ statusLabels[status] }}</option>
				</select>
				<input v-model="newTask.due_date" type="date" />
				<button type="submit">Create Task</button>
			</form>
			<TimeTracker :taskId="selectedTaskId" v-if="selectedTaskId" />
			<Comments :taskId="selectedTaskId" v-if="selectedTaskId" />
			<div class="file-upload">
				<h3>Upload Files</h3>
				<input type="file" @change="handleFileUpload">
				<button @click="submitFile">Upload</button>
				<ul>
					<li v-for="file in files" :key="file.id">{{ file.file }}</li>
				</ul>
			</div>
			<FileList :taskId="selectedTaskId" v-if="selectedTaskId" />
			<FileUploader :taskId="selectedTaskId" v-if="selectedTaskId" />
		</div>
	</div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';
import TimeTracker from './TimeTracker.vue';
import Comments from './CommentsSection.vue';
import FileList from './FileList.vue';
import FileUploader from './FileUploader.vue';

export default {
	components: {
		draggable,
		TaskCard,
		TimeTracker,
		Comments,
		FileList,
		FileUploader,
	},
	props: ['taskId'],
	data() {
		return {
			newProject: {
				name: '',
			},
			newTask: {
				title: '',
				description: '',
				status: 'TODO',
				start_date: null,
				end_date: null,
				project: null,
			},
			selectedFile: null,
			files: [],
			statuses: ['TODO', 'IN_PROGRESS', 'DONE'],
			statusLabels: {
				'TODO': 'To Do',
				'IN_PROGRESS': 'In Progress',
				'DONE': 'Done',
			},
			selectedTaskId: null,
			selectedProjectId: null,
			loading: false,
			error: null,
			tasks: [],
		};
	},
	computed: {
		...mapGetters(['projects', 'tasksByStatus']),
	},
	created() {
		this.fetchProjects().catch(error => console.error('Failed to fetch projects:', error));
		this.fetchTasks().catch(error => console.error('Failed to fetch tasks:', error));
		this.fetchFiles(this.selectedTaskId).catch(error => console.error('Failed to fetch files:', error));
	},
	methods: {
		...mapActions(['fetchProjects', 'createProject', 'fetchTasks', 'createTask', 'uploadFile', 'fetchFiles']),
		selectProject(projectId) {
			this.selectedProjectId = projectId;
			this.newTask.project = projectId;
		},
		async createProject() {
			this.loading = true;
			this.error = null;
			try {
				await this.createProject(this.newProject);
				this.newProject.name = '';
			} catch (err) {
				this.error = 'Failed to create project';
			} finally {
				this.loading = false;
			}
		},
		async createTask() {
			this.loading = true;
			this.error = null;
			try {
				await this.createTask(this.newTask);
				this.newTask.title = '';
				this.newTask.description = '';
				this.newTask.status = 'TODO';
				this.newTask.start_date = null;
				this.newTask.end_date = null;
			} catch (err) {
				this.error = 'Failed to create task';
			} finally {
				this.loading = false;
			}
		},
		onEnd(evt) {
			const movedTask = evt.item.__vue__.$data.task;
			movedTask.status = evt.to.dataset.status;
			this.updateTask(movedTask);
		},
		editTask(task) {
			this.newTask = { ...task };
			this.selectedTaskId = task.id;
		},
		handleFileUpload(event) {
			this.selectedFile = event.target.files[0];
		},
		async submitFile() {
			this.loading = true;
			this.error = null;
			try {
				let formData = new FormData();
				formData.append('file', this.selectedFile);
				formData.append('task', this.selectedTaskId);
				await this.uploadFile(formData);
				this.fetchFiles(this.selectedTaskId);
			} catch (err) {
				this.error = 'Failed to upload file';
			} finally {
				this.loading = false;
			}
		},
		async fetchTasks() {
			try {
				await this.$store.dispatch('fetchTasks');
				this.tasks = this.$store.state.tasks;
			} catch (error) {
				console.error('Error fetching tasks:', error);
			}
		},
	},
};
</script>

<style scoped>
.task-board {
	display: flex;
	flex-direction: row;
}

.project-list {
	width: 200px;
	border-right: 1px solid #ccc;
	padding: 10px;
}

.task-columns {
	display: flex;
	flex-direction: row;
	flex-grow: 1;
	padding: 10px;
}
</style>