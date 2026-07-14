const mongoose = require('mongoose');
const ChapterSchema = mongoose.Schema(
    {


         serialNumber:{
            type: String,    
            default:""
        },


          price:{
            type: Number,    
            default:99
        },


        subjectName:{
            type: String,    
            required:true,
        },

        description:{
            type:String,       
        },
        year:{
            type:String,
            default:""
        },
        courseType:{
            type:String,
            default:""
        },
        imageUrl:{
            type:String,
        }
    },
    
    {
        timestamps: true,
        collection: 'Subject',
    }
);
const Subject = mongoose.model('Subject', ChapterSchema);
module.exports = Subject;