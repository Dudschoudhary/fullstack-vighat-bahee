import AddNewEntriesInterface from "../common/CustomTable"
import CustomVigatBaheeLogo from "../common/CustomVigatBaheeLogo"
import Footer from "../google adsense/Footer"

const VigatBaheeLayout = () => {
  return (
    <>
      <div>
        <div className="mt-5">
          <CustomVigatBaheeLogo/>
        </div>
        <div>
            <AddNewEntriesInterface/>
        </div>
      </div>
        <Footer/>
    </>
  )
}

export default VigatBaheeLayout