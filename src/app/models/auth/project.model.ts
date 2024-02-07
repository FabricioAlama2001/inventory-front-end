export interface ProjectModel {
  id: string;
  code: number;
  name: string;
  description: string;
  suspendedAt: boolean;
}

export interface CreateProjectDto extends Omit<ProjectModel, 'id'> {
}

export interface UpdateProjectDto extends Partial<Omit<ProjectModel, 'id'>> {
}

export interface SelectProjectDto extends Partial<ProjectModel> {
}
