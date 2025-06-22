export const UserRoleEnum = {
  ADMIN: "admin",
  USER: "user",
};

export const AvailableRoles = Object.values(UserRoleEnum);

export const PostStatusEnum = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const AvailablePostStatus = Object.values(PostStatusEnum);

export const postReviewStatusEnum = {
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const AvailablePostReviewStatus = Object.values(postReviewStatusEnum);
