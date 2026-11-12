from fastapi import FastAPI


app=FastAPI()


@app.get("/")
def home():
    return {
        "message":"server runnign successfully",
        "status code":200
    }