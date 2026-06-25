from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends, File, UploadFile 
from app.services.frame_service import process_frame
from app.services.frame_service import process_frame2
from app.dependencies.auth import get_current_user_socket, get_current_user
from app.db.session import get_db;
from sqlalchemy.orm import Session

router = APIRouter();





@router.post("/process_image")
async def process_image(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user = Depends(get_current_user),
):
    image_bytes = await file.read()
    
    result = await process_frame2(image_bytes, db, user)
    
    return result







@router.websocket("/live-object-detection")
async def video_stream(websocket: WebSocket):
    
    
    token = websocket.query_params.get("token")
    
    if not token: 
        raise HTTPException(
            status_code=403,
            detail="Token not Found"
        );
    
    db = next(get_db());
    
    user = get_current_user_socket(token, db);
    
    if not user:
        await websocket.close();
        return
    
    await websocket.accept();
    
    
    try :
        while True:
            
            frame = await websocket.receive_bytes()
            result = await process_frame(frame)
            await websocket.send_json(result);
            
    except WebSocketDisconnect:
        print("Client diconnected")
    finally :
        db.close();