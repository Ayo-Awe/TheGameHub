const OrRibbon = ({colorPicked}) => {
    return (
        <div className='grid grid-cols-[auto_40px_auto] mt-[23px]'>
        <div className='flex items-center'>
            <div className='h-[1.5px]  w-full' style={{backgroundColor: colorPicked ? colorPicked : '#4C54C8'}}></div>
        </div>
        <p className='text-center text-[12px] font-bold'>Or</p>
        <div className='flex items-center'>
            <div className='h-[1.5px]  w-full'  style={{backgroundColor: colorPicked ? colorPicked : '#4C54C8'}}></div>
        </div>
    </div>
    )
}

export default OrRibbon;