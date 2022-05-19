import Link from 'next/link';

const CheckGamesButton = (props) => {
    return (
        <div className='flex justify-center mt-[80px] mb-[90px]'>
            <Link href='/signIn'>
                <button className='px-[49px] py-[16px] bg-[#4041D5] rounded-[12px] poppinsFont font-semibold text-[20px] text-white'>
                    Play Online Now
                </button>
            </Link>
        </div>
    )
}

export default CheckGamesButton;