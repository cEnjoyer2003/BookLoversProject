import React, {useState, useEffect} from 'react';
import ProfilePage from './ProfilePage';
import Board from './Profile/Board';
import NewReviewForm from './Profile/NewReviewForm';
import NewTopForm from './Profile/NewTopForm';
import NewQuoteForm from './Profile/NewQuoteForm';
import MainPage from './MainPage';
import SignIn from './SignIn';
import Register from './Register';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { fetchData } from '../functions';
import Footer from './Footer'; 
import RequireAuth from '../context/RequireAuth';
import AuthContext from '../context/AuthProvider';
import '../styles/SignIn.css';
import '../styles/App.css'
import '../styles/Item.css'
import '../styles/Header.css'
import '../styles/Footer.css'
import '../styles/MainPage.css'
import '../styles/Profile.css'
import '../styles/Register.css'
import '../styles/UserForm.css'
import PasswordResetForm from './PasswordResetForm';
import UserForm from './UserForm';

function App() {
  const [data, setData] = useState({});
  useEffect(() => {
    fetchData(data, setData);
  }, [data?.edit]);
  useEffect(() => {
    setData(JSON.parse(window.localStorage.getItem("data")))
  }, []);
  useEffect(() => {
    if(Object.keys(data).length !== 0) window.localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  return (
    <AuthContext.Provider value={{data, setData}}>
    <Router>
      <div>
        <Routes>
          <Route exact path="/sign-in" element={<SignIn />} />
          <Route exact path="/"><Route index element={<Navigate to="/sign-in" replace />} /></Route>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset-pwd" element={<PasswordResetForm />} />
          <Route exact path="/main-page" element={<MainPage />} />
          <Route element={<RequireAuth allowedRoles={["valid-user", "manager", "admin"]} />}>
            {data && Object.keys(data).length && data.user &&
              <>
                <Route exact path="/my-profile" element={<ProfilePage edit />} />
                <Route exact path="/edit" element={<Register />} />
                <Route exact path={"/my-reviews"} element={
                  <Board edit remove expand username={data.user.username} content="My reviews" items={data.reviews} />
                  } />
                <Route exact path={"/my-tops"} element={
                  <Board edit remove expand username={data.user.username} content="My tops" items={data.tops} />
                  } />
                <Route exact path={"/my-quotes"} element={
                  <Board edit remove expand  username={data.user.username} content="My quotes" items={data.quotes} />
                  } />
                <Route exact path={"/edit-review"} element={
                  <NewReviewForm username={data.user.username} review={data.edit} />
                  } />
                <Route exact path={"/edit-top"} element={
                  <NewTopForm username={data.user.username} top={data.edit} />
                  } />
                <Route exact path={"/edit-quote"} element={
                  <NewQuoteForm username={data.user.username} quote={data.edit} />
                  } />
              </>}
              </Route>
          <Route element={<RequireAuth allowedRoles={["valid-user"]} />}>
          {data.userView && Object.keys(data.userView).length && <>
                <Route exact path={`/${data.userView.user.username}-reviews-view`} element={
                  <Board expand username={data.userView.user.username} content="Reviews" items={data.userView.reviews} />
                  } />
                <Route exact path={`/${data.userView.user.username}-tops-view`} element={
                  <Board expand username={data.userView.user.username} content="Tops" items={data.userView.tops} />
                  } />
                <Route exact path={`/${data.userView.user.username}-quotes-view`} element={
                  <Board expand username={data.userView.user.username} content="Quotes" items={data.userView.quotes} />
                  } />
              </>
              }
          </Route>
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          {data.userView && Object.keys(data.userView).length && <>
                <Route exact path={`/${data.userView.user.username}`} element={<ProfilePage remove />} />
                <Route exact path={`/user-form-${data.userView.user.username}`} element={<UserForm user={data.userView.user} />} />
              </>}
          </Route>
          <Route element={<RequireAuth allowedRoles={["valid-user", "manager"]} />}>
          {data.userView &&  Object.keys(data.userView).length &&
                <Route exact path={`/${data.userView.user.username}-view`} element={<ProfilePage />} />
              }
          </Route>
          <Route element={<RequireAuth allowedRoles={["manager", "admin"]} />}>
          {data.userView &&  Object.keys(data.userView).length &&<>
                <Route exact path={`/${data.userView.user.username}-reviews`} element={
                  <Board expand remove username={data.userView.user.username} content="Reviews" items={data.userView.reviews} />
                  } />
                <Route exact path={`/${data.userView.user.username}-tops`} element={ 
                  <Board expand remove username={data.userView.user.username} content="Tops" items={data.userView.tops} />
                  } />
                <Route exact path={`/${data.userView.user.username}-quotes`} element={ 
                  <Board expand remove username={data.userView.user.username} content="Quotes" items={data.userView.quotes} />
                  } />
              </>}
          </Route>
        </Routes>
        <Footer />
      </div>
    </Router>
    </AuthContext.Provider>);
}

export default App;
