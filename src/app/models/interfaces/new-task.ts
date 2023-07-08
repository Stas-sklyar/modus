export interface NewTask {
  title: string | null | undefined,
  description: string | null | undefined,
  assignedToUserId: string | null | undefined,
  dueDate: Date | null | undefined,
}
