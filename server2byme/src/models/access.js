const mongoose=require("mongoose")

const AccessSchema=mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    targetUserId:{
        type:mongoose.Schema.Types.ObjectId,
          ref:"User"
    },

    hasFamilyAccess:{
        type:Boolean,
        default:false,

    },
    hasContactAccess:{
        type:Boolean,
        default:false,
    },

    hasGalleryAccess:{
        type:Boolean,
        default:false,
    },

    hasMessageAccess:{
        type:Boolean,
        default:false,
    },

},{
    timestamps: true,
    collection:"Access"
})

const Access=new mongoose.model("Access",AccessSchema);
module.exports=Access;