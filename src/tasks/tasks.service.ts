import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';


@Injectable()
export class TasksService {

    constructor( 
      @InjectRepository(TasksRepository) 
      private tasksRepository: TasksRepository
      ){}

    // getAllTasks(): Task[] {
    //     return this.tasks;
    // }

    // getTaskById(id: string): Task {
        
    //     const task = this.tasks.find((task) => task.id === id);

    //     if ( !task ) {
    //         throw new NotFoundException(`Task with ID ${ id } not found`);
    //     }

    //     return task;
    // }
    async getTaskById(id: string): Promise<Task> {

        const task = await this.tasksRepository.findOne( id );

        if ( !task ) {
          throw new NotFoundException(`Task with ID ${ id } not found`);
        }
      
        return task;
    }

    // getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        
    //     const { status, search } = filterDto;

    //     let tasks = this.getAllTasks();

    //     if (status) {            
    //         tasks = tasks.filter((task) => task.status === status);
    //     }

    //     if (search) {
    //         tasks = tasks.filter((task) => {
    //             if (task.title.includes(search) || task.description.includes(search)) {
    //                 return true;
    //             }

    //             return false;
    //         });
    //     }

    //     return tasks;

    // }

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {

      return this.tasksRepository.getTasks( filterDto );

    }

    // createTask( createTaskDto: CreateTaskDto ): Task {

    //     const { title, description } = createTaskDto;

    //     const task: Task = {
    //         id: uuid(),
    //         title,
    //         description,
    //         status: TaskStatus.OPEN
    //     };

    //     this.tasks.push(task);
    //     return task;
    // }

    createTask( createTaskDto: CreateTaskDto ): Promise<Task> {      
      return this.tasksRepository.createTask(createTaskDto);
    }

    // updateTaskStatus(id: string, status: TaskStatus): Task {
    //     const task = this.getTaskById(id);
    //     task.status = status;
    //     return task;
    // }

      async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);

        task.status = status;        
        await this.tasksRepository.save(task);
        return task;
    }    

    // deleteTask(id: string): void {
        
    //     const task = this.getTaskById(id);

    //     this.tasks = this.tasks.filter((task) => task.id !== task.id);
    // }

    async deleteTask(id: string): Promise<void> {
        
      const result = await this.tasksRepository.delete( id );

      if ( result.affected === 0 ) {
        throw new NotFoundException(`Task with Id: ${ id } not found`);
      }
      
    }

}
