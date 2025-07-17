import streamlit as st 
import requests 

st.set_page_config('Pontos', layout='wide')
st.header('Pontos')
st.divider()

form, points_day = st.columns(2)

with form:
  with st.form('login'):
    st.subheader('Login')
    username = st.text_input('Username')
    password = st.text_input('Password', type='password')
    st.form_submit_button('Login')
  

with points_day:
  st.subheader('Pontos do Dia')
  res = requests.get(f'https://gfdp.dizelequefez.com.br/pontos/dia?username={username}&password={password}')

  st.dataframe(
    
    res.json(),
    column_config={
      "":"Pontos",
      "value":"Horas"
    },
    
  )
  
  # st.table(
  #   set
  #   res.json()
  # )

# with list_points:
#   st.subheader('Lista de Pontos')
#   res = requests.get(f'https://gfdp.dizelequefez.com.br/pontos/mes?username={username}&password={password}')
  
#   st.table(res.json())
  
  
