import { useEffect, useState } from "react"
import { useFetch } from "../hooks/useFetch"

const List = () => {
    const [postData, setPostData] = useState([])
    const [editMode, setEditMode] = useState(false);
    const [editedDescription, setEditedDescription] = useState("")
    const [formData, setFormData] = useState({
        img: null,
        description: ""
    })
    const { data, loading, error } = useFetch('http://localhost:3001/posts')
    useEffect(() => {
        if (data) {
            setPostData(data)
            console.log(data);
        }
    }, [data])

    const handleChange = (e) => {
        if (e.target.id === "img") {
            setFormData({
                ...formData,
                img: e.target.files[0]
            })
        } else {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
        console.log(formData);
    }
    const addPost = async () => {
        try {
            const { img, description } = formData
            const data=new FormData()
            data.append("img",img)
            data.append("description",description)
            const res=await fetch("http://localhost:3001/posts",{
                method:"POST",
                body:data
            })
            const post=await res.json()
            console.log(post);
        } catch (error) {
            console.log(error);
        }
    }
    const deletePost = async (id) => {
        try {
            const res=await fetch(`http://localhost:3001/posts/${id}`,{
                method:"DELETE"
            });
            const post=await res.json()
            console.log(post);
            const updateData=postData.filter((post)=>post.id!==id)
            setPostData(updateData)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSaveEdit = async (id) => {
        try {
          const res = await fetch(`http://localhost:3001/posts/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ descripcion: editedDescription }),
          });
          if (res.ok) {
            // Update the post data and toggle off edit mode
            const updatedPostData = postData.map((post) =>
              post.id === id ? { ...post, descripcion: editedDescription } : post
            );
            setPostData(updatedPostData);
            setEditMode(false);
          } else {
            // Handle error here
            console.log("Error while saving edit");
          }
        } catch (error) {
          console.log(error);
        }
      };


    return (
        <div classNameName="container">
            <h1>post</h1>
            <button type="button" className="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#addPost">
                Agregar Post
            </button>
            <div className="modal fade" id="addPost" tabindex="-1" aria-labelledby="addPostLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addPostLabel">Agregar Post</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={addPost}>
                                <div className="mb-3">
                                    <label for="img" className="form-label">Img</label>
                                    <input className="form-control" type="file" id="img" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label for="description" className="form-label">Descripcion</label>
                                    <input type="text" className="form-control" id="description" onChange={handleChange} />
                                </div>
                                <button type="submit" className="btn btn-primary">Agregar</button>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>
            {loading && <div className="mt-3">Loading...</div>}
            {error && <div className="mt-3">Errror: {error}</div>}
            {!loading && !error && postData.map((post) => (
                <div key={post.id} className="card">
                    <img src={`http://localhost:3001/${post.img}`} alt="" className="card img" />
                    <div classNameName="card-body">
                        <h2>{post.descripcion}</h2>
                        <button className="btn btn-warning mx-2" onClick={()=>handleSaveEdit(post.id)}>Editar</button>
                          {(
                            <input
                              type="text"
                              value={editedDescription}
                             // value={post.descripcion}
                              onChange={(e) => setEditedDescription(e.target.value)}
                            />
                          )}                   

                        
                        <button className="btn btn-danger mx-2" onClick={()=>deletePost(post.id)}>Eliminar</button>
                    </div>
                </div>
            ))}
        </div >

    )
}
export default List