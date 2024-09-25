export type PostData = {
  $id: string;
  userId: string;
  title: string;
  details: string;
  timestamp: any;
  like: string[];
  disLike: string[];
  neutral: string[];
  isApproved: boolean;
  isDisApproved: boolean;
  referencePostId?: string;
  postAssets?: string[];
  organizationId?: string;
};

export type PostAssetData = {
  name: string,
  fileUrl: string
}