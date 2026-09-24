function Sidebar() {

    return (

        <div
            style={{
                width: "240px",
                height: "100vh",
                background: "#1f2937",
                color: "white",
                padding: "20px",
                boxSizing: "border-box"
            }}
        >

            <h2>
                Secure ID
            </h2>

            <p
                style={{
                    marginTop:"40px",
                    cursor:"pointer"
                }}
            >
                🏠 Dashboard
            </p>


            <p
                style={{
                    cursor:"pointer"
                }}
            >
                👤 My Identity
            </p>


            <p
                style={{
                    cursor:"pointer"
                }}
            >
                📝 Register Identity
            </p>


            <p
                style={{
                    cursor:"pointer"
                }}
            >
                🔗 Blockchain Records
            </p>


            <p
                style={{
                    cursor:"pointer"
                }}
            >
                ⚙ Settings
            </p>


        </div>

    );

}


export default Sidebar;