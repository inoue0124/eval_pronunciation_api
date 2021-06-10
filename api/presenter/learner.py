from typing import Optional
from fastapi import Depends
from api.domain.repository.repository import Repository
from api.domain.entity.learner import Learner
from api.factory import RepositoryFactory
from api.util.errors import DbError


async def register(registerLearnerRequest: Learner,
                   repository: Repository = Depends(RepositoryFactory.create)):
    try:
        learner = repository.Learner().create(learner=registerLearnerRequest)
    except Exception as e:
        raise DbError(detail=str(e))
    return learner


async def search(page: int,
                 limit: int,
                 search_query: Optional[str] = None,
                 is_asc: Optional[bool] = True,
                 repository: Repository = Depends(RepositoryFactory.create)):
    try:
        learners = repository.Learner().search(page=page,
                                               limit=limit,
                                               search_query=search_query,
                                               is_asc=is_asc)
    except Exception as e:
        raise DbError(detail=str(e))

    return learners