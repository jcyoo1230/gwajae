import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Login from '../component/login';
import AddUser from '../component/addUser';
import Board from '../component/Board';
import Write from '../component/write';
import ContentPage from '../component/ContentPage';

const WebRouter = () => {

    return (
        

        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Login/>}></Route>
                    <Route path='/addUser' element={<AddUser/>}></Route>
                    <Route path='/board' element={<Board/>}></Route>                    
                    <Route path='/write' element={<Write/>}></Route>
                    <Route path='/contentpage' element={<ContentPage/>}></Route>
                </Routes>
            
            </BrowserRouter>
        </div>
    );
};

export default WebRouter;