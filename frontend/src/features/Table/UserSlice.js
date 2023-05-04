import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  UserInfo:{uid:1,name:"admin","email":"nhan0303.yopmail.net"}
}

export const UserSlice = createSlice({
    name:'User',
    initialState,
    reducers: {
        setUser: (state,action)=>{
            state.UserInfo = action.payload
        },
    }
})

export const {setUser} = UserSlice.actions
export default UserSlice.reducer