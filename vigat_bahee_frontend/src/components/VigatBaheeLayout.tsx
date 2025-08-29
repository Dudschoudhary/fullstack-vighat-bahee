import AddNewEntriesInterface from "../common/CustomTable"
import CustomVigatBaheeLogo from "../common/CustomVigatBaheeLogo"

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
    </>
  )
}

export default VigatBaheeLayout