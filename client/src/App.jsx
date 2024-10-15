import { Navbar , Loader , Services , Transactions , Footer , Welcome } from './components';

function App() {

  return (
     <div className='min-h-screen'>
     <div className='gradient-bg-welcome'>
      <Navbar></Navbar>
      <Welcome></Welcome>
     </div>
     <Services></Services>
     <Transactions></Transactions>
     <Footer></Footer>
     </div>
  )
}

export default App
