import axiosInstance from "../utils/requestInstance";
import { toast } from "react-toastify";
import environment from "../../enviroment";

const Service = {
  async verify(payload={}) {
    try {
      const response = await axiosInstance.get(`${environment.endPoint}/api/v1/website/user/verify`, {
        params: payload,
      });
      let data = response.data.result;
      return data;
    } catch (error) {
      toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
      console.log(error);
    }
  },


  async getChapterById(id) {
    try {
      const response = await axiosInstance.get(`${environment.endPoint}/api/v1/website/user/getChapterById/${id}`, {
      });
      
      let data = response.data.result;
      return data;
    } catch (error) {
      toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
      console.log(error);
    }
  },


    async getAllSubject(id) {
    try {
      const response = await axiosInstance.get(`${environment.endPoint}/api/v1/website/user/getAllSubject`, {
      });
      
      let data = response.data.result;
      return data;
    } catch (error) {
      toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
      console.log(error);
    }
  },



  async createPayment({body}) {
    try {
      const response = await axiosInstance.post(`${environment.endPoint}/api/v1/website/paymentGateWay/createPayment`,body);
        
    return response
    } catch (error) {
      console.log("Your error",error)
      toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
      console.log(error);
    }
  },



    async getPyamentSettings(id) {
    try {
      const response = await axiosInstance.get(`${environment.endPoint}/api/v1/website/user/getSetting`, {
      });
      
      let data = response.data.result;
      return data;
    } catch (error) {
      toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
      console.log(error);
    }
  },









//   async Create(payload) {
//     try {
//        const response = await axiosInstance.post(`/user/register`,payload);
//        const data=response.data.result
//        toast.success(data.message);
//     return data;
//     } catch (error) {
//       toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
//       console.log(error);
//     }
//   },

//   async getById(payload) {
//     try {
//        const response = await axiosInstance.get(`/user/getById/${payload}`);
//     return response.data;
//     } catch (error) {
//       toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
//       console.log(error);
//     }
//   },


//   async updateById(payload,id) {
//     try {
//        const response = await axiosInstance.put(`/user/updateById/${id}`,payload);
//        let data=response.data.result;
//        toast.success(data.message)
//     return data;
//     } catch (error) {
//       toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
//       console.log(error);
//     }
//   },

//   async delete(id) {
//     try {
//        const response = await axiosInstance.delete(`/user/delete/${id}`);
//        let data=response.data.result;
//        toast.success(data.message)
//     return data;
//     } catch (error) {
//       toast.error(error.response.data.message?error.response.data.message:"Internal Server Error");
//       console.log(error);
//     }
//   },
};

export default Service;
