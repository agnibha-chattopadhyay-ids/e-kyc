'use client'
import React, { Fragment, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import { Tab } from "@headlessui/react";
import { GET_ENTITY_DETAILS,GET_ENTITY_DOCUMENT_FOR_ENTITY } from '@/configs/graphql/queries';
import { useQuery } from 'graphql-hooks';
import SkeletionTable from '@/components/skeleton/Table';
import BasicDetails from './BasicDetails';
import KYBData from './KYBData';
import ListUsers from './ListUsers';
import BlockchainChapter from './BlockchainChapter';
import MouDocument from './MOU/MouPage'
import { useDispatch } from 'react-redux';
import { setEntityDetail } from '@/store/registeredEntityReducer';
import { useSelector } from 'react-redux';

const buttons = [
  {
    title: 'Basic Details',
    icon: 'heroicons-outline:user',
  },
  {
    title: 'KYB Data',
    icon: 'heroicons-outline:circle-stack',
  },
  {
    title: 'List of Users',
    icon: 'heroicons-outline:list-bullet',
  },
  {
    title: 'Blockchain Chapter',
    icon: 'heroicons-outline:information-circle',
  },
  {
    title: 'MoU Documents',
    icon: 'heroicons-outline:list-bullet',
  },
];

function UserPage({ params }) {
  const dispatch = useDispatch();
  const identity = params.id;

  const EntityDetail = useCallback((store) => store.registeredEntity, []);
  const { EntityDetails } = useSelector(EntityDetail);

  const {data:userData } = useQuery(GET_ENTITY_DOCUMENT_FOR_ENTITY, {
    variables: { _id:identity },
  });
    const { loading, error, data } = useQuery(GET_ENTITY_DETAILS, {
      variables: { id: identity },
      onSuccess: (res) => {
        dispatch(setEntityDetail(res?.data?.getEntity));
      },
    });

    if (loading) return <SkeletionTable />;
    if (error) return <pre>{error.message}</pre>;

    return (
      <div className="bg-transparent dark:bg-gray-900 p-5 mb-16">
        <Tab.Group>
          <Tab.List className="lg:space-x-8 md:space-x-4 space-x-0 rtl:space-x-reverse">
            {buttons.map((item, i) => (
              <Tab as={Fragment} key={i}>
                {({ selected }) => (
                  <button
                    className={` inline-flex items-start text-base font-medium mb-7 capitalize dark:bg-transparent ring-0 foucs:ring-0 focus:outline-none px-6 transition duration-150 before:transition-all before:duration-150 relative before:absolute
                     before:left-1/2 before:bottom-[-6px] before:h-[1.5px]
                      before:bg-primary-500 before:-translate-x-1/2
              ${
                selected
                  ? 'text-primary-500 before:w-full'
                  : 'text-slate-500 before:w-0 dark:text-slate-300'
              }
              `}
                  >
                    <span className="text-base relative top-[1px] ltr:mr-1 rtl:ml-1">
                      <Icon className="h-6 w-6" icon={item.icon} />
                    </span>
                    {item.title}
                  </button>
                )}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
                <BasicDetails userData={EntityDetails} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
                <KYBData userData={EntityDetails} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="text-slate-600 dark:text-slate-400 text-sm font-normal">
                <ListUsers userData={EntityDetails} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className=" dark:bg-gray-900 text-slate-600 dark:text-slate-400 text-sm font-normal">
                <BlockchainChapter userData={EntityDetails} />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className=" dark:bg-gray-900 text-slate-600 dark:text-slate-400 text-sm font-normal">
                <MouDocument userData={userData?.getEntityDocumentForEntity} Data={EntityDetails}/>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    );
}

export default UserPage;




