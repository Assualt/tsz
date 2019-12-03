
# Table tsz_user_pswd
SQL_QUERY_ID_EXISTS = 'select user_id from tsz_user_pswd where user_name=%s'
SQL_QUERY_ID_PASSWD = 'select user_id,user_encrypt_pass from tsz_user_pswd where user_name = %s'
SQL_INSERT_VAL = 'insert into tsz_user_pswd(user_id,user_name,user_encrypt_pass) values(%s,%s,%s)'
SQL_QUERY_ID = 'select max(user_id) from tsz_user_pswd'

# Table tsz_user
SQL_INSERT_TSZ_USER = 'insert into tsz_user(user_id,user_name,user_nichen,user_uni,user_desc,user_address,user_addIndex,user_otheraddIndex,user_phone,user_sex,user_age) ' \
                      'values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)'

SQL_QUERY_TSZ_USER = 'select user_id,user_name,user_nichen,user_uni,user_desc,user_address,user_addIndex,user_otheraddIndex,user_phone,user_sex,user_age from tsz_user ' \
                     'where user_id = %s'