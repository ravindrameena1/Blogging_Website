import {mongoose , Schema} from 'mongoose';

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    share: {
        type: Number,
        default: 0,
    },
    theme:{
        type: String,
        enum: ['light', 'dark' , 'vincent'],
        default: 'light',
    }
},{timestamps: true});

export const Blog = mongoose.model('Blog', blogSchema);