import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
function Home() {
	const auth = useSelector((state) => state.auth);
	const navigate = useNavigate();
	useEffect(() => {
		if (auth.isauth) {
			if (auth.type == "admin") {
				navigate("/admin");
			} else if (auth.type == "client") {
				navigate("/client");
			}
		}
	});
	return (
		<div className="container mt-5 text-center">
			<div className="jumbotron">
				<h1 className="display-4">Welcome to Door2dooR</h1>
				<p className="lead">We provide the best route for your parcel according to your needs.</p>
				<hr className="my-4" />
				<p>Login or Signup to get started.</p>

				<div className="d-flex justify-content-center gap-3">
					<button className="btn btn-primary btn-lg mx-2" onClick={() => navigate("/client/login")}>
						Client Login
					</button>
					<button className="btn btn-outline-primary btn-lg mx-2" onClick={() => navigate("/client/signup")}>
						Client Signup
					</button>
				</div>

				<div className="mt-4">
					<button className="btn btn-secondary btn-sm" onClick={() => navigate("/admin/login")}>
						Admin Access
					</button>
				</div>
			</div>
		</div>
	);
}

export default Home;
