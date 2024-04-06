import React, { use, useCallback, useRef } from 'react';
import Card from '@/components/ui/Card';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import Textinput from '@/components/ui/Textinput';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import { useQuery, useMutation } from 'graphql-hooks';
import { useDispatch } from 'react-redux';
import { UPDATE_KYB_DATA } from '@/configs/graphql/mutations';
import { toast } from 'react-toastify';
import { setEntityDetail } from '@/store/registeredEntityReducer';
import { PUT_OBJECT_PRESIGNED_URL_MUTATION } from '@/configs/graphql/mutations';
import UploadGetPreSignedUrl, {
  HandleUpload,
} from '../../../../../../lib/upload';
import PdfViewerModal from '@/components/features/PDFViewer/PdfViewerModal';
import { Icon } from '@iconify/react';
import { GET_OBJECT_QUERY } from '@/configs/graphql/queries';
import Textarea from '@/components/ui/Textarea';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
const schema = yup
  .object({
    kybData: yup.object({
      legalName: yup.string().required('Name is Required'),
      type: yup.string().required('Type is Required'),
      legalAddress: yup.string().required('Address is Required'),
      cinNumber: yup.string().required('Cin is Required'),
    }),
  })
  .required();

const KYBData = ({ userData }) => {
  const hiddenFileInput = useRef(null);
  const dispatch = useDispatch();
  const [readonly, setReadOnly] = useState(true);
  const [updateKybDataMutation] = useMutation(UPDATE_KYB_DATA);

  const [preAssigenedUrl, setPreAssigenedUrl] = useState();
  const [File, setFile] = useState('');
  const [pdfKey, setPdfKey] = useState(userData?.kybData?.cinFile);
  const [uploadFileMutation] = useMutation(PUT_OBJECT_PRESIGNED_URL_MUTATION);

  const [s3BucketUrl, setS3BucketurlUrl] = useState();

  const { loading, data, error } = useQuery(GET_OBJECT_QUERY, {
    variables: { key: userData?.kybData?.cinFile },
    onSuccess: (res) => {
      setS3BucketurlUrl(res.data.getObject.url);
    },
  });

  // console.log(userData?.kybData?.cinFile, s3BucketUrl);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => {
    setModalOpen((prevState) => !prevState);
  };
  const handleFileClick = () => {
    if (!readonly) {
      hiddenFileInput.current.click();
    } else {
      toast.info('Click "Edit" to upload files.');
    }
  };
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });
  useEffect(() => {
    reset(userData);
  }, [userData]);
  // console.log(userData);
  const assigneeOptions = [
    {
      value: ' University',
      label: ' University',
    },

    {
      value: 'College',
      label: 'College',
    },
    {
      value: 'Company',
      label: 'Company',
    },
    {
      value: 'Startup',
      label: 'Startup',
    },
    {
      value: 'Goverment',
      label: 'Goverment',
    },
  ];
  const onSubmit = async (reqData) => {
    try {
      if (File) {
        const statusCode = await HandleUpload({
          url: preAssigenedUrl,
          file: File,
          type: File?.type.split('/')[1],
        });
        // console.log('Upload response code:', statusCode);
      }

      const { data: mutationData, error } = await updateKybDataMutation({
        variables: {
          _id: userData?._id,
          input: {
            legalName: reqData.kybData.legalName,
            cinFile: pdfKey,
            type: reqData.kybData.type,
            legalAddress: reqData.kybData.legalAddress,
            cinNumber: reqData.kybData.cinNumber,
            kybStatus: 0,
          },
        },
      });
      if (error) throw new Error(error);

      // console.log('Data added KYBdata', mutationData);
      dispatch(setEntityDetail(mutationData?.updateEntity));
      toast.success('Updated successfully', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      setReadOnly(true);
    } catch (error) {
      console.error('Error updating KybData:', error);
      toast.error('Something went wrong', {
        position: 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  const allowEdit = () => {
    setReadOnly(!readonly);
  };

  const handleOnChange = async (event) => {
    event.preventDefault();
    try {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        setFile(file);
        const { key, url } = await UploadGetPreSignedUrl({
          file,
          uploadFileMutation,
        });
        setPdfKey(key);
        setPreAssigenedUrl(url);
      } else {
        toast.warn('Please upload a PDF file');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };
  const viewPdfHandler = () => {
    if (s3BucketUrl) {
      toggleModal();
    }
  };

  return (
    <div>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <Card className="bg-white rounded-none" bodyClass="p-0">
          <div className="mb-8 p-6 border-b-2 w-full">
            <h6>Organisation Details</h6>
          </div>
          <div className="px-6 lg:gap-x-36 gap-x-14 grid md:grid-cols-2 justify-items-center">
            <div className="w-full ">
              <Textinput
                name="kybData.legalName"
                label="Legal Name of Organisation"
                placeholder="Enter Name"
                type="text"
                register={register}
                error={errors?.kybData?.legalName}
                msgTooltip
                readonly={readonly}
              />
            </div>
            <div className="w-full ">
            <Controller
                name="kybData.type"
                control={control}
                defaultValue={
                  assigneeOptions.find((option) => option.value === data?.kybData?.type)?.label
                } 
                render={({ field: { onChange, value } }) => (
                  <div>
                    <label className="form-label" htmlFor="icon_s">
                    Organisation type
                    </label>
                    <Select
                      options={assigneeOptions}
                      value={assigneeOptions.find((c) => c.value === value)}
                      onChange={(val) => onChange(val.value)}
                      isMulti={false}
                      className="react-select"
                      classNamePrefix="select"
                      defaultValue={0}
                      isDisabled={readonly}
                      id="icon_s"
                      placeholder={'Select Type '}
                    />
                    {errors.type && (
                      <p className="text-red-500">{errors?.kybData?.type}</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="d-flex w-full">
              <div>CIN/PRN Certificate</div>
              <div
                className={`pointer ${
                  readonly
                    ? 'flex items-center w-full h-12 dark:bg-slate-600 bg-slate-200 rounded my-3'
                    : ' bg-white flex items-center w-full border dark:border-none h-12 dark:bg-slate-900 rounded my-3'
                }`}
              >
                <span className=" rounded-md cursor-pointer overflow-hidden text-sm px-2">
                  {File ? File.name : userData?.kybData?.cinFile}
                </span>

                <div className="flex ml-auto items-center">
                  <Icon
                    className="h-6 w-6 cursor-pointer text-slate-400"
                    icon="heroicons-outline:eye"
                    onClick={() => viewPdfHandler()}
                  />
                  <input
                    ref={hiddenFileInput}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) => handleOnChange(event)}
                  />
                </div>
                <div className="flex ml-2">
                  <Button
                    className={`pointer ${
                      readonly
                        ? 'opacity-70 cursor-not-allowed text-black bg-slate-300 dark:bg-slate-700 dark:text-slate-100  rounded'
                        : ' bg-slate-200 dark:bg-slate-700 '
                    }`}
                    onClick={handleFileClick}
                    disabled={readonly}
                  >
                    Upload File
                  </Button>
                </div>
              </div>
            </div>

            <div className="w-full">
              <Textarea
                name="kybData.legalAddress"
                label="Legal Address of Organisation"
                placeholder="Enter Legal Address"
                type="text"
                register={register}
                error={errors?.kybData?.legalAddress}
                autoComplete="off"
                readonly={readonly}
              />
            </div>
            <div className="w-full">
              <Textinput
                name="kybData.cinNumber"
                label="CIN Number"
                placeholder="Cin number"
                type="text"
                register={register}
                error={errors?.kybData?.cinNumber}
                autoComplete="off"
                readonly={readonly}
              />
            </div>
          </div>

          <div className="p-6 flex w-full justify-center md:justify-end">
            {readonly === true ? (
              <Button
                text="Edit"
                className="btn-dark text-white py-2 w-full md:w-1/6"
                onClick={allowEdit}
              />
            ) : (
              <div className="w-full flex  lg:gap-x-36 md:gap-x-14  md:grid grid-cols-2">
                <div></div>
                <div className="w-full flex justify-end gap-x-12">
                  <Button
                    text="Submit"
                    type="submit"
                    className="btn btn-dark text-white py-2 w-2/6"
                  />
                  <Button
                    text="Cancel"
                    className="bg-danger-500 hover:bg-danger-600 text-white py-2 w-2/6"
                    onClick={allowEdit}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </form>

      <PdfViewerModal
        modalOpen={modalOpen}
        pdfUrl={s3BucketUrl}
        toggleModal={toggleModal}
        title={File?.name || userData?.kybData?.cinFile}
      />
    </div>
  );
};

export default KYBData;