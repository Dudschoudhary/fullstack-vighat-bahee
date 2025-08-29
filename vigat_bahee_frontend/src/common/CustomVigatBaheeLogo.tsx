import baheeLogo from '../../src/assets/images/vigat-bahee.png'

const CustomVigatBaheeLogo = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 lg:gap-5 mb-5 lg:mb-7">
          <div className="flex-shrink-0">
            <img
              src={baheeLogo}
              alt="Bahee Logo"
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rounded-full object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium text-red-500 rozhaOne-Regular leading-tight">
              विगत बही
            </h1>
          </div>
        </div>
    </>
  )
}

export default CustomVigatBaheeLogo