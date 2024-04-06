"use client";
import React, { useCallback } from 'react';
import { GET_ENTITY_BY_USER, LIST_ALL_USERS } from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import Table from './table';
import { useDispatch } from 'react-redux';
import { setAllRegisteredEntity } from '@/store/registeredEntityReducer';
import { useSelector } from 'react-redux';
const StarterPage = () => {
  const dispatch = useDispatch();
  const AllRegEntity = useCallback((state) => state.registeredEntity, []);
  const { AllRegisteredEntities } = useSelector(AllRegEntity);

  const { error, loading, data } = useQuery(GET_ENTITY_BY_USER, {
    onSuccess: (res) => {
      dispatch(setAllRegisteredEntity(res?.data?.getEntityByUser));
    },
  });
  if (loading) return <SkeletionTable />;
  if (error) return <pre>{error.message}</pre>;

  const datatWithId = [AllRegisteredEntities].map((obj, index) => ({
    ...obj,
    id: index + 1,
  }));

  return (
    <div>
      <div className=" dark:bg-gray-900 p-5 mb-16">
        <Table items={datatWithId} />
      </div>
    </div>
  );
};

export default StarterPage;
