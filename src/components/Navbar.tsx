import React from 'react'

const Navbar: React.FC = () => {
    return (
        <div className="w-[30%] h-screen p-6 gap-2 flex flex-col">
                <h2 className="font-extrabold text-3xl mb-4"> Faye Xiao </h2>
                <div className="w-full h-px bg-gray-300 my-2"></div>

                <h3 className="font-bold text-2xl "> About Me </h3>
                <h4 className="font-xl"> Hi I'm Faye, product innovator and creative. Welcome to my skill tree! Every word here is written by me, not AI.</h4>
                <div className="w-full h-px bg-gray-300 my-2"></div>

                <h3> Check out my SkillTree! </h3>

                <div className="flex flex-col gap-2 pl-4">
                    
                    <h4> Art </h4>
                    <h4> Teaching </h4>
                    <h4> Entrepreneurship </h4>
                    <div className="w-full"> </div>

                </div>

               

        
        </div>

    )
    }

export default Navbar
