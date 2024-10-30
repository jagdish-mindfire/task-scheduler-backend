const { z } = require('zod');
const constantStrings = require('../constants/strings');

const getAllTaskSchema =  z.object({
    sort: z
        .string()
        .optional()
        .transform((sort) => (sort && ['asc', 'desc'].includes(sort.toLowerCase()) ? sort.toLowerCase() : 'asc')),
});

const createTaskSchema = z.object({
    title: z
        .string({ required_error: constantStrings.TASK_TITLE_MIN_LENGTH })
        .min(1, constantStrings.TASK_TITLE_MIN_LENGTH)
        .max(100, constantStrings.TASK_TITLE_MAX_LENGTH),
    description: z
        .string({ required_error: constantStrings.TASK_DESCRIPTION_MIN_LENGTH })
        .min(1, constantStrings.TASK_DESCRIPTION_MIN_LENGTH)
        .max(1000, constantStrings.TASK_DESCRIPTION_MAX_LENGTH)
        .optional(),
    due_date: z
        .string({ required_error: constantStrings.DUE_DATE_CANNOT_BE_EMPTY })
        .regex(/^\d{4}-\d{2}-\d{2}$/, { message: constantStrings.DUE_DATE_CANNOT_BE_EMPTY })
        .transform((dateStr) => new Date(dateStr))
        .optional(),
});


const updateTaskSchema = z.object({
    title: z
        .string()
        .min(1, constantStrings.TASK_TITLE_MIN_LENGTH)
        .max(100, constantStrings.TASK_TITLE_MAX_LENGTH)
        .optional(),

    description: z
        .string()
        .min(1, constantStrings.TASK_DESCRIPTION_MIN_LENGTH)
        .max(1000, constantStrings.TASK_DESCRIPTION_MAX_LENGTH)
        .optional(),

    due_date: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/, 
            { message: constantStrings.INVALID_DATE_FORMAT }
        )
        .transform((dateStr) => new Date(dateStr))
        .optional(),

    is_completed: z
        .number()
        .refine((val) => val === 0 || val === 1, {
            message: constantStrings.INVALID_COMPLETED_STATUS,
        })
        .optional(),
});

const deleteTaskSchema = z.object({
    taskId: z
        .string()
        .regex(/^[a-fA-F0-9]{24}$/, { message:  constantStrings.TASK_NOT_FOUND}),
});

module.exports = {getAllTaskSchema,createTaskSchema,updateTaskSchema,updateTaskSchema,deleteTaskSchema};
