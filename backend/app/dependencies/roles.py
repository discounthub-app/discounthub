from fastapi import Depends, HTTPException, status
from app.dependencies.auth import get_current_user  # проверьте путь в вашем проекте
from app.models.user import User as UserModel

def require_admin(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    """
    Зависимость: пропускает только админа.
    Используйте как Depends(require_admin) в create/update/delete.
    """
    if not getattr(current_user, "is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user
